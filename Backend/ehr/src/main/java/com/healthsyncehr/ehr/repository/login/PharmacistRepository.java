package com.healthsyncehr.ehr.repository.login;

import com.healthsyncehr.ehr.entity.Pharmacist.Pharmacist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PharmacistRepository extends JpaRepository<Pharmacist,Long> {


    Optional<Pharmacist> findByEmailId(String email);
}
