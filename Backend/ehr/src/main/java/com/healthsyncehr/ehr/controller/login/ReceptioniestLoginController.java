package com.healthsyncehr.ehr.controller.login;

import com.healthsyncehr.ehr.service.receptionist.ReceptionistLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Receptionist Login",description = "this show all receptionist login api ")
public class ReceptioniestLoginController {
    @Autowired
    ReceptionistLoginService receptionistLoginService;

    @PostMapping("/receptionist/login")
    @Operation(summary = "this api use to login by verifying email and password for receptionist ")
    public Map<String , Object> receptionistLogin(@RequestBody Map<String,String> request){

        return receptionistLoginService.receptionistLoginService(request.get("email"), request.get("password"));

    }
}
