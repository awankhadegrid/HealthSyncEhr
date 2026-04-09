package com.healthsyncehr.ehr.service.pharmacist;

import com.healthsyncehr.ehr.entity.Doctor.Medicines;
import com.healthsyncehr.ehr.medicineStore.MedicineStoreEntity;
import com.healthsyncehr.ehr.medicineStore.MedicineStoreRepo;
import com.healthsyncehr.ehr.repository.Doctor.MedicinesRepo;
import com.healthsyncehr.ehr.repository.pharmacy.PharmacyStoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PharmacyStoreService {
    @Autowired
    PharmacyStoreRepo pharmacyStoreRepo;

    @Autowired
    MedicineStoreRepo medicineStoreRepo;

    @Autowired
    MedicinesRepo medicinesRepo;



    public List<MedicineStoreEntity> getAllMedicineFormMedicineStore() {

        return pharmacyStoreRepo.findAll();

    }

    public Medicines addMedicineToMedicineMaster(Long storeMedicineId, Map<String, String> request) {
        Medicines medicines = new Medicines();
        MedicineStoreEntity medicineStoreEntity = medicineStoreRepo.findById(storeMedicineId).orElseThrow();
        medicines.setDrugName(medicineStoreEntity.getDrugName());
        medicines.setBrandName(medicineStoreEntity.getBrandName());
        medicines.setPricePerQuantity(Integer.valueOf(request.get("pricePerQuantity")));
        return medicinesRepo.save(medicines);

    }
}
