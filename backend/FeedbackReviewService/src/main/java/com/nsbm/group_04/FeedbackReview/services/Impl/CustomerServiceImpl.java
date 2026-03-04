package com.nsbm.group_04.FeedbackReview.services.Impl;

import com.nsbm.group_04.FeedbackReview.DTO.CustomerDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class CustomerServiceImpl {

    public List<CustomerDTO> getAllCustomersFromAPI() {
        String url = "http://13.229.46.111:8080/customers";
        RestTemplate restTemplate = new RestTemplate();

        try {
            CustomerDTO[] customers = restTemplate.getForObject(url, CustomerDTO[].class);
            return Arrays.asList(customers);
        } catch (Exception e) {
            System.err.println("Error connecting to Customer Service: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}
