package com.healthsyncehr.ehr.service.doctor.prescription;

import com.healthsyncehr.ehr.entity.Doctor.Dosages;
import com.healthsyncehr.ehr.entity.Doctor.Durations;
import com.healthsyncehr.ehr.entity.Doctor.Frequencies;
import com.healthsyncehr.ehr.entity.Doctor.Medicines;
import com.healthsyncehr.ehr.entity.Doctor.Prescription.Prescription;
import com.healthsyncehr.ehr.entity.Doctor.Prescription.PrescriptionItem;
import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import com.healthsyncehr.ehr.repository.Doctor.DosagesRepo;
import com.healthsyncehr.ehr.repository.Doctor.DurationsRepo;
import com.healthsyncehr.ehr.repository.Doctor.FrequenciesRepo;
import com.healthsyncehr.ehr.repository.Doctor.MedicinesRepo;
import com.healthsyncehr.ehr.repository.Doctor.prescription.PrescriptionRepo;
import com.healthsyncehr.ehr.repository.receptionist.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PrescriptionServices {
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    DosagesRepo dosagesRepo;
    @Autowired
    FrequenciesRepo frequenciesRepo;
    @Autowired
    DurationsRepo durationsRepo;
    @Autowired
    MedicinesRepo medicinesRepo;
    @Autowired
    PrescriptionRepo prescriptionRepo;


    public Map<String,Object> savePrescription(Long patientId, Map<String, Object> request) {

        Prescription prescription = new Prescription();

        Patient patient = patientRepository.findById(patientId).orElseThrow(()->new RuntimeException("patient not found"));
        prescription.setPatient(patient);
        patient.setStatus(PatientStatus.PRESCRIBED);

        prescription.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());
        List<PrescriptionItem> items = new ArrayList<>();

        List<Map<String, Object>> requestItems = (List<Map<String, Object>>) request.get("items");

        for (Map<String, Object> itemRequest : requestItems) {
            Long medicineId = Long.valueOf(itemRequest.get("medicineId").toString());
            Long dosageId = Long.valueOf(itemRequest.get("dosageId").toString());
            Long frequencyId = Long.valueOf(itemRequest.get("frequencyId").toString());
            Long durationId = Long.valueOf(itemRequest.get("durationId").toString());

            Medicines medicine = medicinesRepo.findById(medicineId)
                    .orElseThrow(() -> new RuntimeException("Medicine not found"));

            Dosages dosage = dosagesRepo.findById(dosageId)
                    .orElseThrow(() -> new RuntimeException("Dosage not found"));

            Frequencies frequency = frequenciesRepo.findById(frequencyId)
                    .orElseThrow(() -> new RuntimeException("Frequency not found"));

            Durations duration = durationsRepo.findById(durationId)
                    .orElseThrow(() -> new RuntimeException("Duration not found"));

            PrescriptionItem item = new PrescriptionItem();
            item.setPrescription(prescription);
            item.setMedicine(medicine);
            item.setDosage(dosage);
            item.setFrequency(frequency);
            item.setDuration(duration);

            items.add(item);
        }
        prescription.setItems(items);

        Prescription savedPrescription = prescriptionRepo.save(prescription);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Prescription saved successfully");
        response.put("prescriptionId", savedPrescription.getPrescriptionId());
        return response;
    }

    public List<Map<String, Object>> getPreviousPrescriptions(Long patientId) {
        List<Prescription> prescriptions = prescriptionRepo.findByPatientPatientId(patientId);
        List<Map<String,Object>> response = new ArrayList<>();
        for (Prescription prescription : prescriptions) {
            Map<String, Object> prescriptionMap = new HashMap<>();
            prescriptionMap.put("prescriptionId", prescription.getPrescriptionId());
            prescriptionMap.put("createdAt", prescription.getCreatedAt());

            List<Map<String, Object>> items = new ArrayList<>();

            for (PrescriptionItem item : prescription.getItems()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("medicineName", item.getMedicine().getMedicineName());
                itemMap.put("dosageValue", item.getDosage().getDosageValue());
                itemMap.put("frequencyValue", item.getFrequency().getFrequency());
                itemMap.put("durationValue", item.getDuration().getDuration());

                items.add(itemMap);
            }

            prescriptionMap.put("items", items);
            response.add(prescriptionMap);
        }
        return response;

    }
}
