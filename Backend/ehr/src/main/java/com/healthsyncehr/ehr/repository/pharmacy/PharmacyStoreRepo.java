package com.healthsyncehr.ehr.repository.pharmacy;

import com.healthsyncehr.ehr.medicineStore.MedicineStoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PharmacyStoreRepo extends JpaRepository<MedicineStoreEntity, Long> {
}
