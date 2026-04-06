package com.healthsyncehr.ehr.repository.Doctor;

import com.healthsyncehr.ehr.entity.Doctor.Medicines;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicinesRepo extends JpaRepository<Medicines,Long> {

}
