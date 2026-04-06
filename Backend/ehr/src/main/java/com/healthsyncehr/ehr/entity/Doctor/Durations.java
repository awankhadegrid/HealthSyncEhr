package com.healthsyncehr.ehr.entity.Doctor;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Durations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long durationId;

    @Column(nullable = false)
    private String duration;

}
