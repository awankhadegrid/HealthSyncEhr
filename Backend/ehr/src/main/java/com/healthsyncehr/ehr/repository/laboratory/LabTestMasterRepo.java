package com.healthsyncehr.ehr.repository.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.LabTestMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabTestMasterRepo extends JpaRepository<LabTestMaster, Long> {
}
