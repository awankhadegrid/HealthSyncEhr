package com.healthsyncehr.ehr.repository.Doctor;

import com.healthsyncehr.ehr.entity.Doctor.Frequencies;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FrequenciesRepo extends JpaRepository<Frequencies,Long> {
}
