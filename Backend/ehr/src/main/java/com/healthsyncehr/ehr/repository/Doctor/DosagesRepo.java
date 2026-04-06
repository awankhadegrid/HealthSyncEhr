package com.healthsyncehr.ehr.repository.Doctor;

import com.healthsyncehr.ehr.entity.Doctor.Dosages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DosagesRepo extends JpaRepository<Dosages,Long> {

}
