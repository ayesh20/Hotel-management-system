package com.nsbm.group_04.service.impl;

import com.nsbm.group_04.entity.Reservation;
import com.nsbm.group_04.repository.ReservationRepository;
import com.nsbm.group_04.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nsbm.group_04.dto.RoomDTO;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;

import java.util.List;

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
        String url = "http://13.61.186.105:8081/api/rooms/all";
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
}