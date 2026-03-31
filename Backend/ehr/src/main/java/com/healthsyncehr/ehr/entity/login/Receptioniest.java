package com.healthsyncehr.ehr.entity.login;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Receptioniest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long receptionistId;

    @Column(nullable = false)
    private String firstName;

    private String lastName;

    private String gender;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String phone;

    private String address;

    @Column(nullable = false)
    private String status;
}
