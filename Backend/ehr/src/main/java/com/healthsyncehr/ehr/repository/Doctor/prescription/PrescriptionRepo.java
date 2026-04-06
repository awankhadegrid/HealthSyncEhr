package com.healthsyncehr.ehr.repository.Doctor.prescription;

import com.healthsyncehr.ehr.entity.Doctor.Prescription.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepo extends JpaRepository<Prescription,Long> {


    List<Prescription> findByPatientPatientId(Long patientId);

}
