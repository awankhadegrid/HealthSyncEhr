package com.healthsyncehr.ehr;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class Controller {

    @RequestMapping("/data")
    public String returnData(){
        return "abhi";
    }
}
