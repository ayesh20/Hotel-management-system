package com.nsbm.group_04.Events.repository;

import com.nsbm.group_04.Events.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    // Used to check double-booking: same hall, same date, same time
    List<Event> findByHallSelectionAndBookingDateAndEventTime(
            String hallSelection, LocalDate bookingDate, LocalTime eventTime);

    // Useful for monitoring/reporting
    List<Event> findByPaymentStatus(String paymentStatus);
    List<Event> findByHallSelection(String hallSelection);
    List<Event> findByBookingDate(LocalDate bookingDate);
    List<Event> findByCustomerId(String customerId);
}