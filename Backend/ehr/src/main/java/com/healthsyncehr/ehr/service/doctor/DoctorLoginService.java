package com.healthsyncehr.ehr.service.doctor;

import com.healthsyncehr.ehr.entity.login.Doctor;
import com.healthsyncehr.ehr.repository.login.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class DoctorLoginService {
    @Autowired
    DoctorRepository doctorRepository;

    public Map<String, Object> doctorLogin(String email, String password) {
        Map<String,Object> user = new HashMap<>();
        Optional<Doctor> doctor = doctorRepository.findByEmailId(email);
        if (doctor.isPresent() && doctor.get().getPassword().equals(password)) {
            user.put("success", true);
            user.put("message", "Doctor login successful");
        } else {
            user.put("success", false);
            user.put("message", "Invalid doctor credentials");
        }

        return user;
    }


}
