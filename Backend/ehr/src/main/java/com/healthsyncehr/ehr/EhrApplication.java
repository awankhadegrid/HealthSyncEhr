package com.healthsyncehr.ehr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EhrApplication {

    public static void main(String[] args) {
        SpringApplication.run(EhrApplication.class, args);
    }
}