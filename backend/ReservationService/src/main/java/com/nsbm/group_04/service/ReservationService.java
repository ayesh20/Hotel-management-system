package com.nsbm.group_04.service;

import com.nsbm.group_04.dto.RoomDTO;
import com.nsbm.group_04.entity.Reservation;
import java.util.List;

public interface ReservationService {
    Reservation createReservation(Reservation reservation);
    List<Reservation> getAllReservations();
    List<RoomDTO> getAvailableRoomsFromAPI();
    Reservation getReservationById(String id);
    Reservation updateReservation(String id, Reservation reservation);
    void deleteReservation(String id);
}