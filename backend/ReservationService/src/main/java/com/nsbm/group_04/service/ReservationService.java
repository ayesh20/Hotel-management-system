package com.nsbm.group_04.service;

import com.nsbm.group_04.dto.CustomerDTO;
import com.nsbm.group_04.dto.RoomDTO;
import com.nsbm.group_04.entity.Reservation;
import java.util.List;

import com.nsbm.group_04.dto.PaymentDTO;


public interface ReservationService {
    Reservation createReservation(Reservation reservation);
    List<Reservation> getAllReservations();
    List<RoomDTO> getAvailableRoomsFromAPI();
    List<CustomerDTO> getAllCustomersFromAPI();
    Reservation getReservationById(String id);
    Reservation updateReservation(String id, Reservation reservation);
    void deleteReservation(String id);
    List<PaymentDTO> getAllPaymentsFromAPI();
}