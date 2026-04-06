package com.healthsyncehr.ehr.entity.login;

import jakarta.persistence.*;

@Entity
public class Medicines {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int medicineId;

    @Column(nullable = false)
    private String medicineName;

    private String brandName;



}
