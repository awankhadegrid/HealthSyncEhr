package com.healthsyncehr.ehr.service.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.LabTechnician;
import com.healthsyncehr.ehr.repository.laboratory.LabTechnicianRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LaboratoryLoginService {


    @Autowired
    LabTechnicianRepo labTechnicianRepo;

    public Map<String, Object> labTechnicianLogin(String email , String  password) {

        Map<String, Object> response = new HashMap<>();

        LabTechnician labTechnician = labTechnicianRepo.findByEmail(email);

        if(email.equals(labTechnician.getEmail()) && password.equals(labTechnician.getPassword())){
            response.put("success",true);
            response.put("message","Lab Technician login successfully ");

        }else {
            response.put("success",false);
            response.put("message" ,"Invalid Technician login credentials");
        }
        return response;
    }
}
