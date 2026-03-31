package com.healthsyncehr.ehr.controller.Doctor;

import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.entity.login.Doctor;
import com.healthsyncehr.ehr.service.doctor.DoctorDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@Tag(name = "Doctor dashboard api" , description = "this class contain all doctor dashboard api")
public class DoctorDashboardController {


    @Autowired
    DoctorDashboardService doctorDashboardService;



    @GetMapping("/patients/in-cabin")
    @Operation(summary = "this is is return all patient having status INCABIN")
    public List<Patient> getPatientListByStatus(){
        return doctorDashboardService.getPatientListByStatus();

    }


}
