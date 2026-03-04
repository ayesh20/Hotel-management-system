package com.nsbm.group_04.BookingTransportService.service;

import com.nsbm.group_04.BookingTransportService.dto.*;
import com.nsbm.group_04.BookingTransportService.entity.Transport;
import com.nsbm.group_04.BookingTransportService.entity.TransportBooking;
import com.nsbm.group_04.BookingTransportService.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class TransportBookingService {

    @Autowired
    private TransportBookingRepository bookingRepository;

    @Autowired
    private TransportRepository transportRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String CUSTOMER_SERVICE_URL =
            "http://13.229.46.111:8080/customers";

    //  Get Customers
    public List<CustomerDTO> getCustomers() {

        CustomerDTO[] customers =
                restTemplate.getForObject(
                        CUSTOMER_SERVICE_URL,
                        CustomerDTO[].class
                );

        return Arrays.asList(customers);
    }

    public List<Transport> getAvailableVehicles() {
        return transportRepository.findByStatus("AVAILABLE");
    }


}