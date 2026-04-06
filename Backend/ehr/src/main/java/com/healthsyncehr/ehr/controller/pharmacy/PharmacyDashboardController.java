package com.healthsyncehr.ehr.controller.pharmacy;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import com.healthsyncehr.ehr.repository.receptionist.PatientRepository;
import com.healthsyncehr.ehr.service.pharmacist.PharmacyDashBoardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
@Tag(name = "pharmacy class" ,description = "this class contain all pharmacy dashboard api")
public class PharmacyDashboardController {
    @Autowired
    PatientRepository patientRepository;
    @Autowired
    PharmacyDashBoardService pharmacyDashBoardService;

    @GetMapping("/patients/prescribed")
    public List<Patient> getPatientByStatus() {
        return pharmacyDashBoardService.getPatientByStatus();
    }
}
