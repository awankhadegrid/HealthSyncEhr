package com.healthsyncehr.medicineStore;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/medicineStore")
@Tag(name = "Medicine Store",description = "this class use to medicine store API")
public class MedicineController {

    @Autowired
    MedicineStoreService medicineStoreService;

    @GetMapping("/getAllMedicineFromApi")
    @Operation(summary = "this API use to get medicine form external Api")
    public String getAllMedicineFormApi(){
        medicineStoreService.getAllMedicineFormApi();
        return "medicine save in database";
    }

}
