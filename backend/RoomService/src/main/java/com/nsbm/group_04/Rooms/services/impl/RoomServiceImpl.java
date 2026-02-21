package com.nsbm.group_04.Rooms.services.impl;

import com.nsbm.group_04.Rooms.entity.Room;
import com.nsbm.group_04.Rooms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RoomServiceImpl {

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Simple DTO to read only roomNumber from the Reservation microservice response.
     * We only need roomNumber for the cross-match, so other fields are ignored.
     */
    static class ReservationDTO {
        private String roomNumber;

        public String getRoomNumber() { return roomNumber; }
        public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    }

    /**
     * Fetches all rooms from own DB, then calls the Reservation microservice (8082)
     * to find out which room numbers are currently reserved.
     * Overrides the status to "RESERVED" for those rooms before returning.
     */
    public List<Room> getAllRoomsWithReservationStatus() {
        String reservationUrl = "http://3.80.120.199:8082/reservations";
        RestTemplate restTemplate = new RestTemplate();

        // Step 1: Get reserved room numbers from Reservation microservice (8082)
        Set<String> reservedRoomNumbers = new HashSet<>();
        try {
            ReservationDTO[] reservations = restTemplate.getForObject(
                    reservationUrl, ReservationDTO[].class
            );
            if (reservations != null) {
                for (ReservationDTO r : reservations) {
                    if (r.getRoomNumber() != null) {
                        reservedRoomNumbers.add(r.getRoomNumber());
                    }
                }
            }
        } catch (Exception e) {
            // If reservation service is down, rooms still load with their DB status
            System.out.println("[RoomServiceImpl] Could not reach reservation service: " + e.getMessage());
        }

        // Step 2: Get all rooms from own DB
        List<Room> allRooms = roomRepository.findAll();

        // Step 3: Override status to RESERVED if roomNumber matches a reservation
        for (Room room : allRooms) {
            if (reservedRoomNumbers.contains(room.getRoomNumber())) {
                room.setStatus("RESERVED");
            }
        }

        return allRooms;
    }
}