package com.healthsyncehr.ehr.entity.laboratory;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class PatientLabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long labResultId;

    @ManyToOne
    @JoinColumn(name = "lab_order_test_id", nullable = false)
    private PatientLabOrderTest patientLabOrderTest;

    @ManyToOne
    @JoinColumn(name = "parameter_id", nullable = false)
    private LabTestParameterMaster parameter;

    @Column(nullable = false)
    private String resultValue;

    private String unitSnapshot;

    private Double minValueSnapshot;

    private Double maxValueSnapshot;

    private String normalTextSnapshot;

    private String flag;

    private LocalDateTime enteredAt;
}
