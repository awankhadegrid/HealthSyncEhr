package com.healthsyncehr.ehr.controller.Doctor.prescription;


import com.healthsyncehr.ehr.entity.Doctor.Prescription.Prescription;
import com.healthsyncehr.ehr.service.doctor.prescription.PrescriptionServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jdk.jfr.Description;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@Tag(name = "Doctor prescription API", description = "this class contain all prescription api from doctor dashboard")
public class DoctorPrescription {

        @Autowired
    PrescriptionServices prescriptionServices;

    @PostMapping("/patients/{patientId}/prescriptions")
    @Operation(summary = "this api use to save an patient prescription ")
    public Map<String, Object> savePrescription(@PathVariable Long patientId, @RequestBody Map<String,Object> request
    ){
        return prescriptionServices.savePrescription(patientId,request);
    }


    @GetMapping("/patients/{patientId}/previousPrescriptions")
    public List<Map<String,Object>> getPreviousPrescriptions(@PathVariable Long patientId){
        return prescriptionServices.getPreviousPrescriptions(patientId);
    }

}
