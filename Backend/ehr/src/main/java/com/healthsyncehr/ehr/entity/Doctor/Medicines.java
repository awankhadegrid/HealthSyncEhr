package com.healthsyncehr.ehr.entity.Doctor;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Medicines {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long medicineId;

    @Column(nullable = false)
    private String medicineName;

    private String brandName;


}
