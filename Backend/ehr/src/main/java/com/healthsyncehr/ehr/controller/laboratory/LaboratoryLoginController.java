package com.healthsyncehr.ehr.controller.laboratory;

import com.healthsyncehr.ehr.service.laboratory.LaboratoryLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LaboratoryLoginController {
    @Autowired
    LaboratoryLoginService laboratoryDashboardService;

    @PostMapping("/laboratory/login")
    public Map<String, Object> labTechnicianLogin(@RequestBody Map<String,String> request){
        return laboratoryDashboardService.labTechnicianLogin(request.get("email"),request.get("password"));
    }


}
