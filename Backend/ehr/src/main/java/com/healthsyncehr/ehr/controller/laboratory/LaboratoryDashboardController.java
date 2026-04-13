package com.healthsyncehr.ehr.controller.laboratory;

import com.healthsyncehr.ehr.entity.laboratory.LabTestMaster;
import com.healthsyncehr.ehr.service.laboratory.DoctorLabTestService;
import com.healthsyncehr.ehr.service.laboratory.LaboratoryDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/laboratory")
public class LaboratoryDashboardController {

    @Autowired
    LaboratoryDashboardService laboratoryDashboardService;

    @Autowired
    DoctorLabTestService doctorLabTestService;

    @PostMapping("/addLabTests")
    public Map<String,Object> createLabTest(@RequestBody Map<String ,Object> request){
        return laboratoryDashboardService.createLabTest(request);
    }

    @GetMapping("/getAllLabTests")
    public List<LabTestMaster> getAllLabTests() {
        return laboratoryDashboardService.getAllLabTests();
    }


    @PostMapping("/prescribeLabTests")
    @Operation(summary = "Doctor prescribes lab tests to patient")
    public Map<String, Object> prescribeLabTests(@RequestBody Map<String, Object> request) {
        return doctorLabTestService.prescribeLabTests(request);
    }

    @GetMapping("/orders/pending")
    @Operation(summary = "Get all pending lab orders with tests")
    public List<Map<String,Object>> getLabPatientHavingPendingStatus(){
        return laboratoryDashboardService.getLabPatientHavingPendingStatus();
    }

    @PostMapping("/orders/sample-collected")
    @Operation(summary = "use to change the status of patient")
    public Map<String,Object> sampleCollectedStatusChange(@RequestBody Map<String,Object> request){
        Long labOrderTestId = Long.valueOf(request.get("labOrderTestId").toString());
        return laboratoryDashboardService.sampleCollectedStatusChange(labOrderTestId);
    }

    @PostMapping("/results/submit")
    public Map<String,Object> savePatientLabReport(@RequestBody Map<String,Object> request) throws Exception {
        return laboratoryDashboardService.savePatientLabReport(request);

    }



}
