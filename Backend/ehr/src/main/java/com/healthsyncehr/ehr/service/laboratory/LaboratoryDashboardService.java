package com.healthsyncehr.ehr.service.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.*;
import com.healthsyncehr.ehr.repository.laboratory.LabTechnicianRepo;
import com.healthsyncehr.ehr.repository.laboratory.LabTestMasterRepo;
import com.healthsyncehr.ehr.repository.laboratory.PatientLabOrderRepo;
import com.healthsyncehr.ehr.repository.laboratory.PatientLabOrderTestRepo;
import com.healthsyncehr.ehr.repository.laboratory.PatientLabResultRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class LaboratoryDashboardService {

    @Autowired
    LabTestMasterRepo labTestMasterRepo;

    @Autowired
    PatientLabOrderTestRepo patientLabOrderTestRepo;

    @Autowired
    PatientLabResultRepo patientLabResultRepo;



    public Map<String, Object> createLabTest(Map<String, Object> request) {
        LabTestMaster labTestMaster = new LabTestMaster();
        labTestMaster.setTestName(request.get("testName").toString());
        labTestMaster.setTestCode(request.get("testCode").toString());
        labTestMaster.setSampleType(request.get("sampleType").toString());
        labTestMaster.setDescription(request.get("description").toString());

        List<LabTestParameterMaster> parameterList = new ArrayList<>();
        List<Map<String,Object>> parameters = (List<Map<String, Object>>) request.get("parameters");

        for(Map<String , Object> items : parameters){

            LabTestParameterMaster labTestParameterMaster = new LabTestParameterMaster();
            labTestParameterMaster.setParameterName(items.get("parameterName").toString());
            labTestParameterMaster.setUnit(items.get("unit")!= null ? items.get("unit").toString() : null);
            labTestParameterMaster.setMinValue(items.get("minValue") != null ? Double.valueOf(items.get("minValue").toString()) : null);
            labTestParameterMaster.setMaxValue(items.get("maxValue") !=null ? Double.valueOf(items.get("maxValue").toString()) : null);
            labTestParameterMaster.setNormalText(items.get("normalText") != null ? items.get("normalText").toString() : null);
            labTestParameterMaster.setDisplayOrder(items.get("displayOrder") != null ? Integer.valueOf(items.get("displayOrder").toString()) : null);
            labTestParameterMaster.setValueType(items.get("valueType") != null ? items.get("valueType").toString() : null);
            labTestParameterMaster.setLabTestMaster(labTestMaster);

            parameterList.add(labTestParameterMaster); 

        }

        labTestMaster.setParameters(parameterList);
        LabTestMaster saveTest = labTestMasterRepo.save(labTestMaster);

        Map<String , Object > response = new HashMap<>();
        response.put("success" , true);
        response.put("message" , "Lab Test are added successfully");
        response.put("labTestId" , saveTest.getLabTestId());
        return response;

    }

    public List<LabTestMaster> getAllLabTests() {
        return labTestMasterRepo.findAll();
    }


    public List<Map<String, Object>> getLabPatientHavingPendingStatus() {
        List<PatientLabOrderTest> pendingTests = patientLabOrderTestRepo.findByStatusIn(Arrays.asList(LabTestStatus.PENDING, LabTestStatus.SAMPLE_COLLECTED));
        List<Map<String, Object>> result = new ArrayList<>();

        for (PatientLabOrderTest orderTest : pendingTests) {
            Map<String, Object> ordersMap = new HashMap<>();

            ordersMap.put("labOrderTestId", orderTest.getLabOrderTestId());
            ordersMap.put("labOrderId", orderTest.getPatientLabOrder().getLabOrderId());
            ordersMap.put("patientId", orderTest.getPatientLabOrder().getPatient().getPatientId());
            ordersMap.put("patientName", orderTest.getPatientLabOrder().getPatient().getFirstName() + " " +
                    orderTest.getPatientLabOrder().getPatient().getLastName());

            ordersMap.put("testName", orderTest.getLabTestMaster().getTestName());
            ordersMap.put("testCode", orderTest.getLabTestMaster().getTestCode());
            ordersMap.put("sampleType", orderTest.getLabTestMaster().getSampleType());
            ordersMap.put("orderedAt", orderTest.getPatientLabOrder().getOrderedAt());
            ordersMap.put("status", orderTest.getStatus());

            ordersMap.put("parameters", orderTest.getLabTestMaster().getParameters());

            result.add(ordersMap);
        }

        return result;
    }


    public Map<String, Object> sampleCollectedStatusChange(Long labOrderTestId) {

        PatientLabOrderTest patientLabOrderTest = patientLabOrderTestRepo.findById(labOrderTestId).orElseThrow();
        patientLabOrderTest.setStatus(LabTestStatus.SAMPLE_COLLECTED);
        patientLabOrderTestRepo.save(patientLabOrderTest);

        Map<String , Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message","Sample marked as collected successfully");
        response.put("labOrderTestId", labOrderTestId);
        return response;

    }

    @Transactional
    public Map<String, Object> savePatientLabReport(Map<String, Object> request) throws Exception {
        Long labOrderTestId = Long.valueOf(request.get("labOrderTestId").toString());
        
        PatientLabOrderTest orderTest = patientLabOrderTestRepo.findById(labOrderTestId).orElseThrow();
        
        List<Map<String, Object>> parameterResults = (List<Map<String, Object>>) request.get("parameterResults");
        String remarks = request.get("remarks") != null ? request.get("remarks").toString() : "";
        
        for (Map<String, Object> param : parameterResults) {
            Long parameterId = Long.valueOf(param.get("parameterId").toString());
            String resultValue = param.get("value").toString();
            String unit = param.get("unit").toString();

            LabTestParameterMaster parameter = null;
            for (LabTestParameterMaster p : orderTest.getLabTestMaster().getParameters()) {
                if (p.getParameterId().equals(parameterId)) {
                    parameter = p;
                    break;
                }
            }
            if (parameter == null) {
                throw new Exception("Parameter not found");
            }
            
            PatientLabResult result = new PatientLabResult();
            result.setPatientLabOrderTest(orderTest);
            result.setParameter(parameter);
            result.setResultValue(resultValue);
            result.setUnitSnapshot(unit);
            result.setMinValueSnapshot(parameter.getMinValue());
            result.setMaxValueSnapshot(parameter.getMaxValue());
            result.setNormalTextSnapshot(remarks);
            result.setEnteredAt(LocalDateTime.now());
            
            patientLabResultRepo.save(result);
        }
        
        orderTest.setStatus(LabTestStatus.DONE);
        orderTest.setRemarks(remarks);
        patientLabOrderTestRepo.save(orderTest);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Lab results submitted successfully!");
        response.put("labOrderTestId", labOrderTestId);
        return response;
    }
}
