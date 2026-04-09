package com.healthsyncehr.ehr.medicineStore;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;

@Service
public class MedicineStoreService {
    @Autowired
    private MedicineStoreRepo medicineStoreRepo;

    private final RestTemplate restTemplate = new RestTemplate();


    public void getAllMedicineFormApi() throws InterruptedException {
            String url = "https://api.fda.gov/drug/label.json?limit=50";


            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            Thread.sleep(10000);
            JsonNode results = response.get("results");

                for (JsonNode item : results) {
                    MedicineStoreEntity med = new MedicineStoreEntity();
                    JsonNode fda = item.get("openfda");

                    if (fda != null && fda.has("brand_name")) {
                        med.setBrandName(fda.get("brand_name").get(0).asText());
                        med.setGenericName(fda.has("generic_name") ? fda.get("generic_name").get(0).asText() : "N/A");
                        med.setDrugName(fda.has("substance_name") ? fda.get("substance_name").get(0).asText() : "N/A");
                        med.setMedicineType(fda.has("product_type") ? fda.get("product_type").get(0).asText() : "Unknown");

                        medicineStoreRepo.save(med);
                    }
                }


    }

    private String timerTime= "01:00";
    public void scheduleTimerForApi(String time) {
        this.timerTime=time;
    }


    @Scheduled(cron = "0 * * * * *")
    public void runScheduledApi() throws InterruptedException {
        String currentTime = LocalTime.now().withSecond(0).withNano(0).toString();

        if(currentTime.equals(timerTime)){
            getAllMedicineFormApi();
        }
    }



}
