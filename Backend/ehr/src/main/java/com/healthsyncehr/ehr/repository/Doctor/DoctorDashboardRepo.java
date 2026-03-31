package com.healthsyncehr.ehr.repository.Doctor;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.login.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DoctorDashboardRepo extends JpaRepository<Patient,Long> {

    @Query("SELECT p FROM Patient p WHERE p.status = 'INCABIN'")
    List<Patient> patientListFindByStatus();

}
