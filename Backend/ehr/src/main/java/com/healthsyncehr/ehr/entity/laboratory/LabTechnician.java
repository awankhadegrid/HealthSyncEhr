package com.healthsyncehr.ehr.entity.laboratory;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class LabTechnician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

}
