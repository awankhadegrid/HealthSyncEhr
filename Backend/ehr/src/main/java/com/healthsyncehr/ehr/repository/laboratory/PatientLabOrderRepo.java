package com.healthsyncehr.ehr.repository.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.PatientLabOrder;
import com.healthsyncehr.ehr.entity.laboratory.PatientLabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientLabOrderRepo extends JpaRepository<PatientLabOrder , Long> {
    List<PatientLabOrder> findByPatientPatientIdOrderByOrderedAtDesc(Long patientId);


    @Query("""
        select distinct o
        from PatientLabOrder o
        left join fetch o.orderedTests t
        left join fetch t.labTestMaster
        where o.patient.patientId = :patientId
        order by o.orderedAt desc
    """)
    List<PatientLabOrder> findOrdersWithTestsByPatientId(Long patientId);


}
