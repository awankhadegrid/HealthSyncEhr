package com.healthsyncehr.ehr.controller.pharmacy;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import com.healthsyncehr.ehr.repository.receptionist.PatientRepository;
import com.healthsyncehr.ehr.service.pharmacist.PharmacyDashBoardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/patients/{patientId}/latest-prescription")
    public Map<String,Object> getLatestPrescription(@PathVariable Long patientId){
        return pharmacyDashBoardService.getLatestPrescription(patientId);
    }

    @PatchMapping("/patients/{patientId}/status")
    public Patient changeStatusToDone(@PathVariable Long patientId){
        return pharmacyDashBoardService.changeStatusToDone(patientId);
    }

}
