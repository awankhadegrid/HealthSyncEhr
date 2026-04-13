package com.healthsyncehr.ehr.repository.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.PatientLabOrderTest;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientLabResultRepo extends JpaRepository<PatientLabResult, Long> {
    List<PatientLabResult> findByPatientLabOrderTest(PatientLabOrderTest orderTest);

    @Query("""
        select r
        from PatientLabResult r
        join fetch r.parameter
        where r.patientLabOrderTest.labOrderTestId in :testIds
    """)
    List<PatientLabResult> findByOrderTestIdsWithParameter(@Param("testIds") List<Long> testIds);

}
