package com.healthsyncehr.ehr.entity.Pharmacist;

import jakarta.persistence.*;
import lombok.Data;

import java.security.PublicKey;

@Entity
@Data
public class Pharmacist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long PharmacistId;

    private String firstName;
    private String lastName;

    @Column(unique = true,nullable = false)
    private String emailId;
    private String password;
    private String qualification;
    private String gender;
    private String licenseNumber;


}
