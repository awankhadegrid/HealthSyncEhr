package com.healthsyncehr.ehr.controller.login;

import com.healthsyncehr.ehr.service.pharmacist.PharmacistLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "pharmacist Login" , description = "this class contain all pharmacist login api")
public class PharmacistLoginController {

    @Autowired
    PharmacistLoginService pharmacistLoginService;

    @PostMapping("/pharmacy/login")
    @Operation(summary = "this api use for the pharmacist Login ")
    public Map<String,Object> pharmacistLogin(@RequestBody Map<String,String> request){
        return pharmacistLoginService.pharmacistLogin(request.get("email"),request.get("password"));
    }

}
