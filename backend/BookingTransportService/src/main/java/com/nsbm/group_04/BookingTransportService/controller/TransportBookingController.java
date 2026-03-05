package com.nsbm.group_04.BookingTransportService.controller;

import com.nsbm.group_04.BookingTransportService.dto.*;
import com.nsbm.group_04.BookingTransportService.entity.Transport;
import com.nsbm.group_04.BookingTransportService.service.TransportBookingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport-bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class TransportBookingController {

    @Autowired
    private TransportBookingService service;

    @GetMapping("/customers")
    public List<CustomerDTO> getCustomers() {
        return service.getCustomers();
    }

    @GetMapping("/available-vehicles")
    public List<Transport> getAvailableVehicles() {
        return service.getAvailableVehicles();
    }

    @PostMapping("/add")
    public TransportBookingResponseDTO createBooking(
            @RequestBody TransportBookingRequestDTO request) {

        return service.createBooking(request);
    }

    @GetMapping
    public List<TransportBookingResponseDTO> getAllBookings() {
        return service.getAllBookings();
    }
}