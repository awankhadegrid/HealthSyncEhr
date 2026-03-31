package com.healthsyncehr.ehr.controller.login;

import com.healthsyncehr.ehr.service.doctor.DoctorLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Doctor login all api",description = "in that we have all operation related to the Doctor Login")
public class DoctorLoginController {

    @Autowired
    DoctorLoginService doctorLoginService;

    @PostMapping("/doctor/login")
    @Operation(summary = "get doctor login details")
    public Map<String ,Object> getDoctor(@RequestBody Map<String, String> request){
        return doctorLoginService.doctorLogin(request.get("email"), request.get("password"));
    }


}
