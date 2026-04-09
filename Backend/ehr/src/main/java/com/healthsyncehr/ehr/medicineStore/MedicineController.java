package com.healthsyncehr.ehr.medicineStore;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/medicineStore")
@Tag(name = "Medicine Store",description = "this class use to medicine store API")
public class MedicineController {

    @Autowired
    MedicineStoreService medicineStoreService;

    @PostMapping("/schedule-sync")
    public Map<String ,String> scheduleTimerForApi(@RequestBody Map<String , String> request){
         medicineStoreService.scheduleTimerForApi(request.get("time"));
        return Map.of("message", "Medicine sync scheduled successfully");

    }

    @GetMapping("/getAllMedicineFromApi")
    @Operation(summary = "this API use to get medicine form external Api")
    public String getAllMedicineFormApi() throws InterruptedException {
        medicineStoreService.getAllMedicineFormApi();
        return "medicine save in database";
    }





}
