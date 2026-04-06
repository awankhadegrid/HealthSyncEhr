package com.healthsyncehr.ehr.service.doctor;
import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.repository.Doctor.*;
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

    public List<Patient> getPatientListByStatus() {
        return doctorDashboardRepo.patientListFindByStatus();
    }

    public Map<String,Object> getPrescriptionDropDownData() {
        Map<String,Object> prescriptionDropDownData = new HashMap<>();
        prescriptionDropDownData.put("medicines",medicinesRepo.findAll());
        prescriptionDropDownData.put("durations",durationsRepo.findAll());
        prescriptionDropDownData.put("dosages",dosagesRepo.findAll());
        prescriptionDropDownData.put("frequencies",frequenciesRepo.findAll());

        return prescriptionDropDownData;

    }
}
