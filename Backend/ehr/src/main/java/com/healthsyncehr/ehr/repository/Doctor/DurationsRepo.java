package com.healthsyncehr.ehr.repository.Doctor;

import com.healthsyncehr.ehr.entity.Doctor.Durations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DurationsRepo extends JpaRepository<Durations,Long> {
}
