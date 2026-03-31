package com.healthsyncehr.ehr.entity.login;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doctorId;

    @Column(unique = true, nullable = false)
    private String emailId;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;
    private String qualification;
    private String gender;
    private String status;

}
