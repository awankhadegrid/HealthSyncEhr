package com.healthsyncehr.ehr.controller.Doctor;

import com.healthsyncehr.ehr.entity.Doctor.Prescription.Prescription;
import com.healthsyncehr.ehr.entity.appentity.Patient;
import com.healthsyncehr.ehr.service.doctor.DoctorDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/prescriptions/options")
    @Operation(summary = "this api is use to get dropDown data for the prescription")
    public Map<String,Object> getPrescriptionDropDownData(){
        return doctorDashboardService.getPrescriptionDropDownData();
    }

}
