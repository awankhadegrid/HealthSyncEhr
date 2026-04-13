package com.healthsyncehr.ehr.repository.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.LabTechnician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabTechnicianRepo extends JpaRepository<LabTechnician,Long> {
    LabTechnician findByEmail(String email);

}
