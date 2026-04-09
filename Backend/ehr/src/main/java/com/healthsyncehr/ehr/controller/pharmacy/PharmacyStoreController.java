package com.healthsyncehr.ehr.controller.pharmacy;

import com.healthsyncehr.ehr.entity.Doctor.Medicines;
import com.healthsyncehr.ehr.medicineStore.MedicineStoreEntity;
import com.healthsyncehr.ehr.service.pharmacist.PharmacyStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicineStore")
public class PharmacyStoreController {

    @Autowired
    PharmacyStoreService pharmacyStoreService;

    @GetMapping("/medicines")
    public List<MedicineStoreEntity> getAllMedicineFormMedicineStore(){
        return pharmacyStoreService.getAllMedicineFormMedicineStore();
    }

    @PostMapping("/medicines/{storeMedicineId}/add-to-master")
    public Medicines addMedicineToMedicineMaster(@PathVariable Long storeMedicineId, @RequestBody Map<String, String> request){

        return pharmacyStoreService.addMedicineToMedicineMaster(storeMedicineId,request);

    }

}
