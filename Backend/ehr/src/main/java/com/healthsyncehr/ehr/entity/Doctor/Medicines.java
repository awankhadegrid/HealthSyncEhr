package com.healthsyncehr.ehr.entity.Doctor;

import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Medicines {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long medicineId;

    @Column(nullable = false)
    private String drugName;

    private String brandName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineType medicine_type;

    @Column(name = "price_per_quantity")
    private Integer pricePerQuantity;

}
