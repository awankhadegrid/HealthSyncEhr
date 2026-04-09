package com.healthsyncehr.ehr.service.doctor;

import com.healthsyncehr.ehr.entity.Doctor.MedicineType;
import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.repository.Doctor.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
