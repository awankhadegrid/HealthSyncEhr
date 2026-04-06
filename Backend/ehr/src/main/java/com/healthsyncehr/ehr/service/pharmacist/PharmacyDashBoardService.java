package com.healthsyncehr.ehr.service.pharmacist;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import com.healthsyncehr.ehr.repository.receptionist.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PharmacyDashBoardService {

    @Autowired
    PatientRepository patientRepository;

    public List<Patient> getPatientByStatus() {
        return patientRepository.findByStatus(PatientStatus.PRESCRIBED);

    }

}
