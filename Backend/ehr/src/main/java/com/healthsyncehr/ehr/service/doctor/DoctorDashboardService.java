package com.healthsyncehr.ehr.service.doctor;

import com.healthsyncehr.ehr.entity.Doctor.MedicineType;
import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabOrder;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabOrderTest;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabResult;
import com.healthsyncehr.ehr.repository.Doctor.*;
import com.healthsyncehr.ehr.repository.laboratory.PatientLabOrderRepo;
import com.healthsyncehr.ehr.repository.laboratory.PatientLabResultRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DoctorDashboardService {

    @Autowired
    DoctorDashboardRepo doctorDashboardRepo;

    @Autowired
    MedicinesRepo medicinesRepo;

    @Autowired
    DurationsRepo durationsRepo;

    @Autowired
    FrequenciesRepo frequenciesRepo;

    @Autowired
    DosagesRepo dosagesRepo;

    @Autowired
    PatientLabOrderRepo patientLabOrderRepo;

    @Autowired
    PatientLabResultRepo patientLabResultRepo;


    public List<Patient> getPatientListByStatus() {
        return doctorDashboardRepo.patientListFindByStatus();
    }

    public Map<String,Object> getPrescriptionDropDownData() {
        Map<String,Object> prescriptionDropDownData = new HashMap<>();
        prescriptionDropDownData.put("medicines",medicinesRepo.findAll());
        prescriptionDropDownData.put("durations",durationsRepo.findAll());
        prescriptionDropDownData.put("dosages",dosagesRepo.findAll());
        prescriptionDropDownData.put("frequencies",frequenciesRepo.findAll());
        prescriptionDropDownData.put("medicineTypes", buildMedicineTypes());
        prescriptionDropDownData.put("quantities", buildQuantities());

        return prescriptionDropDownData;

    }

    private List<Map<String, String>> buildMedicineTypes() {
        return java.util.Arrays.stream(MedicineType.values())
                .map(type -> {
                    Map<String, String> option = new HashMap<>();
                    option.put("id", type.name());
                    option.put("label", formatLabel(type.name()));
                    return option;
                })
                .toList();
    }

    private List<Map<String, String>> buildQuantities() {
        return java.util.stream.IntStream.rangeClosed(1, 20)
                .mapToObj(value -> {
                    Map<String, String> option = new HashMap<>();
                    option.put("id", String.valueOf(value));
                    option.put("label", String.valueOf(value));
                    return option;
                })
                .toList();
    }

    private String formatLabel(String value) {
        String lowerCase = value.toLowerCase();
        return Character.toUpperCase(lowerCase.charAt(0)) + lowerCase.substring(1);
    }


    @Transactional
    public List<Map<String, Object>> getPreviousLabReports(Long patientId) {
        List<PatientLabOrder> orders = patientLabOrderRepo.findOrdersWithTestsByPatientId(patientId);
        List<Map<String, Object>> response = new ArrayList<>();

        List<Long> testIds = new ArrayList<>();
        for (PatientLabOrder order : orders) {
            if (order.getOrderedTests() != null) {
                for (PatientLabOrderTest test : order.getOrderedTests()) {
                    testIds.add(test.getLabOrderTestId());
                }
            }
        }

        Map<Long, List<PatientLabResult>> resultsByTestId = new HashMap<>();
        if (!testIds.isEmpty()) {
            List<PatientLabResult> allResults = patientLabResultRepo.findByOrderTestIdsWithParameter(testIds);
            for (PatientLabResult result : allResults) {
                Long testId = result.getPatientLabOrderTest().getLabOrderTestId();
                resultsByTestId.computeIfAbsent(testId, k -> new ArrayList<>()).add(result);
            }
        }

        for (PatientLabOrder order : orders) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("labOrderId", order.getLabOrderId());
            orderMap.put("orderedAt", order.getOrderedAt());
            orderMap.put("status", order.getStatus());

            List<Map<String, Object>> tests = new ArrayList<>();
            List<PatientLabOrderTest> orderedTests =
                    order.getOrderedTests() == null ? new ArrayList<>() : order.getOrderedTests();

            for (PatientLabOrderTest test : orderedTests) {
                Map<String, Object> testMap = new HashMap<>();
                testMap.put("labOrderTestId", test.getLabOrderTestId());
                testMap.put("testName", test.getLabTestMaster() != null ? test.getLabTestMaster().getTestName() : null);
                testMap.put("sampleType", test.getLabTestMaster() != null ? test.getLabTestMaster().getSampleType() : null);
                testMap.put("status", test.getStatus());

                List<Map<String, Object>> results = new ArrayList<>();
                List<PatientLabResult> resultEntities =
                        resultsByTestId.getOrDefault(test.getLabOrderTestId(), new ArrayList<>());

                for (PatientLabResult result : resultEntities) {
                    Map<String, Object> resultMap = new HashMap<>();
                    resultMap.put("labResultId", result.getLabResultId());
                    resultMap.put("parameterId", result.getParameter() != null ? result.getParameter().getParameterId() : null);
                    resultMap.put("parameterName", result.getParameter() != null ? result.getParameter().getParameterName() : null);
                    resultMap.put("resultValue", result.getResultValue());
                    resultMap.put("unit", result.getUnitSnapshot());
                    resultMap.put("minValue", result.getMinValueSnapshot());
                    resultMap.put("maxValue", result.getMaxValueSnapshot());
                    resultMap.put("normalText", result.getNormalTextSnapshot());
                    resultMap.put("flag", result.getFlag());
                    results.add(resultMap);
                }

                testMap.put("results", results);
                tests.add(testMap);
            }

            orderMap.put("tests", tests);
            response.add(orderMap);
        }

        return response;
    }


}
