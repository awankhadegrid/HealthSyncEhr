package com.healthsyncehr.ehr.repository.receptionist;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient,Long> {

    List<Patient> findByPhone(String phone);

    List<Patient> findByStatusIn(List<PatientStatus> statuses);

    @Query("SELECT p FROM Patient p WHERE DATE(p.createdAt) = :date")
    List<Patient> findByCreatedAtDate(@Param("date") LocalDate date);

    List<Patient> findByStatus(PatientStatus status);

}
