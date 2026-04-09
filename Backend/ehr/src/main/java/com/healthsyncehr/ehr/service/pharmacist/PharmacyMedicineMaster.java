package com.healthsyncehr.ehr.service.pharmacist;

import com.healthsyncehr.ehr.entity.Doctor.Dosages;
import com.healthsyncehr.ehr.entity.Doctor.Durations;
import com.healthsyncehr.ehr.entity.Doctor.Frequencies;
import com.healthsyncehr.ehr.entity.Doctor.Medicines;
import com.healthsyncehr.ehr.repository.Doctor.DosagesRepo;
import com.healthsyncehr.ehr.repository.Doctor.DurationsRepo;
import com.healthsyncehr.ehr.repository.Doctor.FrequenciesRepo;
import com.healthsyncehr.ehr.repository.Doctor.MedicinesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PharmacyMedicineMaster {
    @Autowired
    MedicinesRepo medicinesRepo;

    @Autowired
    DosagesRepo dosagesRepo;

    @Autowired
    DurationsRepo durationsRepo;

    @Autowired
    FrequenciesRepo frequenciesRepo;


    public Map<String, Object> getAllDropDownData() {
        Map<String, Object> response = new HashMap<>();
        response.put("medicines",medicinesRepo.findAll());
        response.put("dosages" , dosagesRepo.findAll());
        response.put("frequencies", frequenciesRepo.findAll());
        response.put("durations",durationsRepo.findAll());
        return response;

     }

    public Medicines addMedicine(Medicines medicines) {
        return medicinesRepo.save(medicines);
    }

    public Dosages addDosage(Dosages dosages) {
        return dosagesRepo.save(dosages);
    }

    public Frequencies addFrequencies(Frequencies frequencies) {
        return frequenciesRepo.save(frequencies);
    }

    public Durations addDurations(Durations durations) {
        return durationsRepo.save(durations);
    }
}
