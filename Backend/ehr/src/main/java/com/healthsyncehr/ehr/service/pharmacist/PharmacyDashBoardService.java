package com.healthsyncehr.ehr.service.pharmacist;

import com.healthsyncehr.ehr.entity.Doctor.Prescription.Prescription;
import com.healthsyncehr.ehr.entity.Doctor.Prescription.PrescriptionItem;
import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import com.healthsyncehr.ehr.repository.Doctor.prescription.PrescriptionRepo;
import com.healthsyncehr.ehr.repository.receptionist.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PharmacyDashBoardService {

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    PrescriptionRepo prescriptionRepo;

    public List<Patient> getPatientByStatus() {
        return patientRepository.findByStatus(PatientStatus.PRESCRIBED);
    }

    public Map<String, Object> getLatestPrescription(Long patientId) {
        List<Prescription> prescriptionList = prescriptionRepo.findByPatientPatientIdOrderByCreatedAtDesc(patientId);

        if (prescriptionList.isEmpty()) {
            throw new RuntimeException("there is no prescription prescribed");
        }

        Prescription latestPrescription = prescriptionList.get(0);
        Map<String,Object> response = new HashMap<>();
        response.put("prescriptionId", latestPrescription.getPrescriptionId());
        response.put("createdAt", latestPrescription.getCreatedAt());
        response.put("totalBill", latestPrescription.getTotalBill());

        List<Map<String , Object>> items = new ArrayList<>();

        for (PrescriptionItem item : latestPrescription.getItems()) {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("medicineName", item.getDrugName());
            itemMap.put("medicineType", item.getMedicineType());
            itemMap.put("quantity", item.getQuantity());
            itemMap.put("dosageValue", item.getDosage().getDosageValue());
            itemMap.put("frequencyValue", item.getFrequency().getFrequency());
            itemMap.put("durationValue", item.getDuration().getDuration());
            itemMap.put("pricePerMedicine", item.getPricePerMedicine());
            items.add(itemMap);
        }

        response.put("items", items);

        return response;
    }

    public Patient changeStatusToDone(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setStatus(PatientStatus.DONE);
        return patientRepository.save(patient);
    }

    public Map<String, Object> getAllDropDownData() {
        Map<String , Object> response = new HashMap<>();
        return response;
    }
}
