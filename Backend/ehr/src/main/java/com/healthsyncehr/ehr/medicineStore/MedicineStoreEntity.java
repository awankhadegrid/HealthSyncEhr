package com.healthsyncehr.ehr.medicineStore;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.validator.constraints.UniqueElements;

@Entity
@Data
public class MedicineStoreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String brandName;
    private String genericName;
    private String drugName;
    private String medicineType;
}
