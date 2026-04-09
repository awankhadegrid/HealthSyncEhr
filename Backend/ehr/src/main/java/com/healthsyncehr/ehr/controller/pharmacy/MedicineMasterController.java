package com.healthsyncehr.ehr.controller.pharmacy;

import com.healthsyncehr.ehr.entity.Doctor.Dosages;
import com.healthsyncehr.ehr.entity.Doctor.Durations;
import com.healthsyncehr.ehr.entity.Doctor.Frequencies;
import com.healthsyncehr.ehr.entity.Doctor.Medicines;
import com.healthsyncehr.ehr.service.pharmacist.PharmacyDashBoardService;
import com.healthsyncehr.ehr.service.pharmacist.PharmacyMedicineMaster;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy")
@Tag(name = "MedicineMaster All API",description = "this class contain all API of medicine master")
public class MedicineMasterController {

    @Autowired
    PharmacyMedicineMaster pharmacyMedicineMaster;

    @GetMapping("/masters/prescription-options")
    @Operation(summary = "this api is use to get all data of drop down option ")
    public Map<String,Object> getAllDropDownData(){
        return pharmacyMedicineMaster.getAllDropDownData();
    }

    @PostMapping("/masters/medicines")
    @Operation(summary = "this api is to add medicine in the database")
    public Medicines addMedicine(@RequestBody Medicines medicines){
        return pharmacyMedicineMaster.addMedicine(medicines);
    }
    @PostMapping("/masters/addDosages")
    @Operation(summary = "this api is to add medicine in the database")
    public Dosages addDosage(@RequestBody Dosages dosages){
        return pharmacyMedicineMaster.addDosage(dosages);
    }

    @PostMapping("/masters/addFrequencies")
    @Operation()
    public Frequencies addFrequencies(@RequestBody Frequencies frequencies){
        return pharmacyMedicineMaster.addFrequencies(frequencies);
    }
    @PostMapping("/masters/addDurations")
    @Operation()
    public Durations addDurations(@RequestBody Durations durations){
        return pharmacyMedicineMaster.addDurations(durations);
    }




}
