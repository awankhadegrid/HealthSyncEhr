package com.healthsyncehr.ehr.entity.laboratory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LabTestParameterMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long parameterId;

    @ManyToOne
    @JoinColumn(name = "lab_test_id", nullable = false)
    @JsonIgnore
    private LabTestMaster labTestMaster;

    @Column(nullable = false)
    private String parameterName;

    private String unit;

    private Double minValue;

    private Double maxValue;

    private String normalText;

    private Integer displayOrder;

    private String valueType;
}
