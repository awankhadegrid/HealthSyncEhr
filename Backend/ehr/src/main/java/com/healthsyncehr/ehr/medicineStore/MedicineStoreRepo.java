package com.healthsyncehr.medicineStore;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineStoreRepo extends JpaRepository<MedicineStoreEntity,Long> {
}
