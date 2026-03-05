package com.nsbm.group_04.service.impl;

import com.nsbm.group_04.entity.Reservation;
import com.nsbm.group_04.repository.ReservationRepository;
import com.nsbm.group_04.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nsbm.group_04.dto.RoomDTO;
import com.nsbm.group_04.dto.CustomerDTO;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;

import java.util.Collections;
import java.util.List;

import com.nsbm.group_04.dto.PaymentDTO;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.Collections;

@Service
public class ReservationServiceImplementation implements ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getReservationById(String id) {
        // .orElse(null) is safe; if not found, it returns null instead of crashing
        return reservationRepository.findById(id).orElse(null);
    }

    @Override
    public Reservation updateReservation(String id, Reservation reservation) {
        // Check if exists first
        if (reservationRepository.existsById(id)) {
            reservation.setId(id); // Ensure the ID matches
            return reservationRepository.save(reservation);
        }
        return null; // Or throw an exception
    }

    @Override
    public void deleteReservation(String id) {
        reservationRepository.deleteById(id);
    }

    @Override
    public List<RoomDTO> getAvailableRoomsFromAPI() {
        String url = "http://18.142.250.35:8081/api/rooms/all";
        RestTemplate restTemplate = new RestTemplate();

        try {
            // 1. Call the external URL
            // 2. Convert the JSON response into an Array of RoomDTO[]
            RoomDTO[] rooms = restTemplate.getForObject(url, RoomDTO[].class);

            // 3. Return as a List
            return Arrays.asList(rooms);
        } catch (Exception e) {
            e.printStackTrace();
            return List.of(); // Return empty list if connection fails
        }
    }
    @Override
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

    @Override
    public List<PaymentDTO> getAllPaymentsFromAPI() {
        // Your friend's Payment Service URL
        String url = "http://13.212.144.21:8082/api/payments";
        RestTemplate restTemplate = new RestTemplate();

        try {
            PaymentDTO[] payments = restTemplate.getForObject(url, PaymentDTO[].class);
            return Arrays.asList(payments);
        } catch (Exception e) {
            System.err.println("Error connecting to Payment Service: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}