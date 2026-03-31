package com.healthsyncehr.ehr.repository.login;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.login.Receptioniest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.*;
import java.util.List;
import java.util.Optional;

public interface ReceptionistRepository extends JpaRepository<Receptioniest,Long> {
    Optional<Receptioniest> findByEmail(String email);
    List<Patient> findByPhone(String phone);
}
