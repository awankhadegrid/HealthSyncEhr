package com.healthsyncehr.ehr.controller.receptionist;

import com.healthsyncehr.ehr.controller.Doctor.DoctorDashboardController;
import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.appentity.PatientStatus;
import com.healthsyncehr.ehr.service.receptionist.ReceptionistDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

@RestController
@RequestMapping("/api/receptionist")
@Tag(name = "receptionist Dashboard", description = "it shows receptionist Dashboard all api")
public class DashboardController {

    @Autowired
    ReceptionistDashboardService receptionistDashboardService;

    @Autowired
    DoctorDashboardController doctorDashboardController;

    @GetMapping("/patients/listbystatus")
    @Operation(summary = "this api is use to return List of patient with status PENDING and INCABIN  ")
    public List<Patient> getPatientsByStatus(@RequestParam List<PatientStatus> statuses) {
        return receptionistDashboardService.getPatientsByStatus(statuses);
    }

    @GetMapping("/patients/search")
    @Operation(summary = "this is api for the search patient by the phone")
    public List<Patient> searchPatientsByPhone(@RequestParam String phone){
        return receptionistDashboardService.searchPatientsByPhoneService(phone);
    }

    @PostMapping("/patients/register")
    @Operation(summary = "this api is to register patient")
    public Patient registerPatient(@RequestBody Patient patient) {
        return receptionistDashboardService.registerPatient(patient);
    }

    @PatchMapping("/patients/{patientId}/status")
    @Operation(summary = "this api is use to change status when move to cabin then INCABIN and add in cabin than PENDING ")
    public Patient updatePatientStatus(@PathVariable Long patientId, @RequestBody Map<String, String> request) {
        return receptionistDashboardService.updatePatientStatus(patientId, request.get("status"));
    }

    @GetMapping("/patients/by-date")
    public List<Patient> getPatientsByDate(@RequestParam LocalDate date) {
        return receptionistDashboardService.getPatientsByDate(date);
    }


}
