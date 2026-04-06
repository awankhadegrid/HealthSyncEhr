package com.healthsyncehr.ehr.entity.Doctor.Prescription;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "prescription",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PrescriptionItem> items;


}
