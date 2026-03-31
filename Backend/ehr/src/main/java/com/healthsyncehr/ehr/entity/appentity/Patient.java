package com.healthsyncehr.ehr.entity.appentity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long patientId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;

    private LocalDate dateOfBirth;

    @Column(length = 10)
    private String gender;

    private String bloodGroup;

    @Column(length = 500)
    private String address;

    private String emergencyContactName;

    private String emergencyContactPhone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PatientStatus status = PatientStatus.PENDING;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
