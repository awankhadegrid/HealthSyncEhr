package com.healthsyncehr.medicineStore;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MedicineStoreService {
    @Autowired
    private MedicineStoreRepo medicineStoreRepo;

    private final RestTemplate restTemplate = new RestTemplate();


    public void getAllMedicineFormApi() {
            String url = "https://api.fda.gov/drug/label.json?limit=10";

            // 1. Call API
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            JsonNode results = response.get("results");

            // 2. Loop through results
            for (JsonNode item : results) {
                MedicineStoreEntity med = new MedicineStoreEntity();
                JsonNode fda = item.get("openfda");

                if (fda != null && fda.has("brand_name")) {
                    med.setBrandName(fda.get("brand_name").get(0).asText());
                    med.setGenericName(fda.has("generic_name") ? fda.get("generic_name").get(0).asText() : "N/A");
                    med.setDrugName(fda.has("substance_name") ? fda.get("substance_name").get(0).asText() : "N/A");
                    med.setMedicineType(item.has("product_type") ? item.get("product_type").asText() : "Unknown");

                    // 3. Save to Database
                    medicineStoreRepo.save(med);
                }
            }
    }
}
