package com.nsbm.group_04.controller;

import com.nsbm.group_04.entity.Reservation;
import com.nsbm.group_04.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Wrapper for HTTP responses (200 OK, 404 Not Found)
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 1. Tells Spring: "I am the Waiter. I handle web requests."
@RequestMapping("/reservations") // 2. The Base URL. All endpoints start with /reservations
public class ReservationController {

    @Autowired
    private ReservationService reservationService; // Inject the Chef

    // 1. Create a Reservation (POST)
    // URL: http://localhost:8082/reservations
    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.createReservation(reservation);
    }

    // 2. Get All Reservations (GET)
    // URL: http://localhost:8082/reservations
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    // 3. Get One Reservation by ID (GET)
    // URL: http://localhost:8082/reservations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable String id) {
        Reservation reservation = reservationService.getReservationById(id);
        if (reservation != null) {
            return ResponseEntity.ok(reservation); // Return 200 OK with data
        } else {
            return ResponseEntity.notFound().build(); // Return 404 Not Found
        }
    }

    // 4. Update Reservation (PUT)
    // URL: http://localhost:8082/reservations/{id}
    @PutMapping("/{id}")
    public Reservation updateReservation(@PathVariable String id, @RequestBody Reservation reservation) {
        return reservationService.updateReservation(id, reservation);
    }

    // 5. Delete Reservation (DELETE)
    // URL: http://localhost:8082/reservations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable String id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build(); // Return 204 No Content (Successful deletion)
    }
}