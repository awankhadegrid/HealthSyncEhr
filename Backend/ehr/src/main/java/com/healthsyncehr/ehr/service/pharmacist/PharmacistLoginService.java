package com.healthsyncehr.ehr.service.pharmacist;

import com.healthsyncehr.ehr.entity.Pharmacist.Pharmacist;
import com.healthsyncehr.ehr.repository.login.PharmacistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PharmacistLoginService {
    @Autowired
    PharmacistRepository pharmacistRepository;

    public Map<String, Object> pharmacistLogin(String email, String password) {
        Map<String,Object > response = new HashMap<>();
        Optional<Pharmacist> pharmacist = pharmacistRepository.findByEmailId(email);

        if(pharmacist.isPresent() && pharmacist.get().getPassword().equals(password)){
            response.put("success",true);
            response.put("message","user login successfully");
        }else {
            response.put("success",false);
            response.put("message","user login failed");
        }
        return response;

    }
}
