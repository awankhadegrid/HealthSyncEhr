package com.healthsyncehr.ehr.entity.Doctor;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Frequencies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long frequencyId;

    @Column(nullable = false)
    private String frequency;
}
