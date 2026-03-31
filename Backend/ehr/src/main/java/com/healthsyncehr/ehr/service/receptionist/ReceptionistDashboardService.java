package com.healthsyncehr.ehr.service.receptionist;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import com.healthsyncehr.ehr.repository.login.ReceptionistRepository;
import com.healthsyncehr.ehr.repository.receptionist.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReceptionistDashboardService {

    @Autowired
    PatientRepository patientRepository;

    public List<Patient> searchPatientsByPhoneService(String phone){
        return patientRepository.findByPhone(phone);
    }

    public Patient registerPatient(Patient patient) {
            patient.setStatus(PatientStatus.PENDING);
            patient.setCreatedAt(LocalDateTime.now());
            return patientRepository.save(patient);
    }

    public List<Patient> getPatientsByStatus(List<PatientStatus> statuses) {
        return patientRepository.findByStatusIn(statuses);
    }

    public Patient updatePatientStatus(Long patientId, String status) {
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        patient.setStatus(PatientStatus.valueOf(status));
        patient.setUpdatedAt(LocalDateTime.now());
        return patientRepository.save(patient);
    }

    public List<Patient> getPatientsByDate(LocalDate date) {
        return patientRepository.findByCreatedAtDate(date);
    }
}
