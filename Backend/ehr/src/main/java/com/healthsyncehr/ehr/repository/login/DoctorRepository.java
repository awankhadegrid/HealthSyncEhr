package com.healthsyncehr.ehr.repository.login;

import com.healthsyncehr.ehr.entity.login.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmailId(String emailId);
}
