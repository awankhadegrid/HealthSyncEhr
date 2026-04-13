package com.healthsyncehr.ehr.entity.laboratory;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class PatientLabOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long labOrderId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    private LocalDateTime orderedAt;

    @Enumerated(EnumType.STRING)
    private LabTestStatus status;

    private String notes;

    @OneToMany(mappedBy = "patientLabOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PatientLabOrderTest> orderedTests;

}
