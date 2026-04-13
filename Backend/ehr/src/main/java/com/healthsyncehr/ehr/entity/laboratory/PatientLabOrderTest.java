package com.healthsyncehr.ehr.entity.laboratory;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class PatientLabOrderTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long labOrderTestId;

    @ManyToOne
    @JoinColumn(name = "lab_order_id", nullable = false)
    private PatientLabOrder patientLabOrder;

    @ManyToOne
    @JoinColumn(name = "lab_test_id", nullable = false)
    private LabTestMaster labTestMaster;

    @Enumerated(EnumType.STRING)
    private LabTestStatus status;

    private String remarks;

    @OneToMany(mappedBy = "patientLabOrderTest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PatientLabResult> results;

}
