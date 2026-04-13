package com.healthsyncehr.ehr.entity.laboratory;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class LabTestMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long labTestId;

    @Column(nullable = false, unique = true)
    private String testName;

    private String testCode;

    private String sampleType;

    private String description;

    @OneToMany(mappedBy = "labTestMaster", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LabTestParameterMaster> parameters;

}
