package com.healthsyncehr.ehr.service.laboratory;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.laboratory.LabTestMaster;
import com.healthsyncehr.ehr.entity.laboratory.LabTestStatus;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabOrder;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabOrderTest;
import com.healthsyncehr.ehr.repository.Doctor.DoctorDashboardRepo;
import com.healthsyncehr.ehr.repository.laboratory.LabTestMasterRepo;
import com.healthsyncehr.ehr.repository.laboratory.PatientLabOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class DoctorLabTestService {

    @Autowired
    DoctorDashboardRepo doctorDashboardRepo;

    @Autowired
    LabTestMasterRepo labTestMasterRepo;

    @Autowired
    PatientLabOrderRepo patientLabOrderRepo;


    @Transactional
    public Map<String, Object> prescribeLabTests(Map<String, Object> request) {
        Map<String , Object> response = new HashMap<>();
        try {
            // Validate patient ID
            if (request.get("patientId") == null) {
                response.put("success", false);
                response.put("message", "Patient ID is required");
                return response;
            }

            Long patientId = Long.valueOf(request.get("patientId").toString());
            
            // Validate lab tests list
            List<Map<String ,Object>> labTests = (List<Map<String, Object>>) request.get("labTests");
            if (labTests == null || labTests.isEmpty()) {
                response.put("success", false);
                response.put("message", "At least one lab test is required");
                return response;
            }

            // Find patient
            Optional<Patient> patientOpt = doctorDashboardRepo.findById(patientId);
            if (!patientOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Patient not found with ID: " + patientId);
                return response;
            }

            Patient patient = patientOpt.get();

            PatientLabOrder patientLabOrder = new PatientLabOrder();
            patientLabOrder.setPatient(patient);
            patientLabOrder.setOrderedAt(LocalDateTime.now());
            patientLabOrder.setStatus(LabTestStatus.PENDING);
            patientLabOrder.setNotes("LAB TEST");

            List<PatientLabOrderTest> orderedTests = new ArrayList<>();

            for (Map<String, Object> labTest : labTests) {
                Long labTestId = Long.valueOf(labTest.get("labTestId").toString());

                Optional<LabTestMaster> labTestMaster = labTestMasterRepo.findById(labTestId);
                if(!labTestMaster.isPresent()){
                    continue;
                }

                LabTestMaster testMaster = labTestMaster.get();

                PatientLabOrderTest orderTest = new PatientLabOrderTest();

                orderTest.setPatientLabOrder(patientLabOrder);
                orderTest.setLabTestMaster(testMaster);
                orderTest.setStatus(LabTestStatus.PENDING);
                orderTest.setRemarks(labTest.get("sampleType") != null ?
                        "Sample Type: " + labTest.get("sampleType").toString() : "");

                orderedTests.add(orderTest);
            }

            // Set tests to order
            patientLabOrder.setOrderedTests(orderedTests);

            // Save to database
            PatientLabOrder savedOrder = patientLabOrderRepo.save(patientLabOrder);

            response.put("success", true);
            response.put("message", "Lab tests prescribed successfully");
            response.put("labOrderId", savedOrder.getLabOrderId());
            response.put("totalTests", orderedTests.size());

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error prescribing lab tests: " + e.getMessage());
        }

        return response;

    }
}
