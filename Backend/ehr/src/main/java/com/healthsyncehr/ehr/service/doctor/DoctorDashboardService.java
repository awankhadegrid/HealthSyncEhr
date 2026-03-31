package com.healthsyncehr.ehr.service.doctor;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.login.Doctor;
import com.healthsyncehr.ehr.repository.Doctor.DoctorDashboardRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorDashboardService {

    @Autowired
    DoctorDashboardRepo doctorDashboardRepo;

    public List<Patient> getPatientListByStatus() {
        return doctorDashboardRepo.patientListFindByStatus();
    }
}
