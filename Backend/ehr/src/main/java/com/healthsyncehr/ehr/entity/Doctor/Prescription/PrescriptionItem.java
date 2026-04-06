package com.healthsyncehr.ehr.entity.Doctor;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionItemId;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @ManyToOne
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicines medicine;

    @ManyToOne
    @JoinColumn(name = "dosage_id", nullable = false)
    private Dosages dosage;

    @ManyToOne
    @JoinColumn(name = "frequency_id", nullable = false)
    private Frequencies frequency;

    @ManyToOne
    @JoinColumn(name = "duration_id", nullable = false)
    private Durations duration;

}
