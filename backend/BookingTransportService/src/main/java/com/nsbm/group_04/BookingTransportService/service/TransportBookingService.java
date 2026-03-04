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

    public TransportBookingResponseDTO createBooking(
            TransportBookingRequestDTO request) {

        // Get Vehicle
        Transport vehicle = transportRepository
                .findById(request.getVehicleId())
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found"));

        if (!vehicle.getStatus().equalsIgnoreCase("AVAILABLE")) {
            throw new RuntimeException("Vehicle not available");
        }

        // Get Customer from CustomerService
        CustomerDTO customer =
                restTemplate.getForObject(
                        CUSTOMER_SERVICE_URL + "/" + request.getCustomerId(),
                        CustomerDTO.class
                );

        // Create Booking Entity
        TransportBooking booking = new TransportBooking();

        booking.setCustomerId(customer.getId());
        booking.setCustomerName(customer.getFullName());

        booking.setVehicleId(vehicle.getId());
        booking.setVehicleType(vehicle.getVehicleType());
        booking.setPricePerDay(vehicle.getPricePerDay());

        booking.setFromLocation(request.getFromLocation());
        booking.setToLocation(request.getToLocation());

        booking.setBookingDate(LocalDate.now());
        booking.setStatus("CONFIRMED");

        // Update vehicle status
        vehicle.setStatus("BOOKED");
        transportRepository.save(vehicle);

        TransportBooking saved = bookingRepository.save(booking);

        // Prepare Response DTO
        TransportBookingResponseDTO response =
                new TransportBookingResponseDTO();

        response.setBookingId(saved.getId());
        response.setCustomerName(saved.getCustomerName());
        response.setVehicleType(saved.getVehicleType());
        response.setPricePerDay(saved.getPricePerDay());
        response.setFromLocation(saved.getFromLocation());
        response.setToLocation(saved.getToLocation());
        response.setStatus(saved.getStatus());
        response.setBookingDate(saved.getBookingDate());

        return response;
    }


}