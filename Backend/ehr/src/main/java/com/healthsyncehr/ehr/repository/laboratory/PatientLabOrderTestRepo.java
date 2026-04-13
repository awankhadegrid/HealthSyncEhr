package com.healthsyncehr.ehr.repository.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.LabTestStatus;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabOrderTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PatientLabOrderTestRepo extends JpaRepository<PatientLabOrderTest , Long> {

    List<PatientLabOrderTest> findByStatusIn(Collection<LabTestStatus> statuses);
}
