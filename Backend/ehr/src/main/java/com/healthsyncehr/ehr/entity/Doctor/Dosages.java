package com.healthsyncehr.ehr.entity.Doctor;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Dosages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dosageId;

    @Column(nullable = false)
    private String dosageValue;


}
