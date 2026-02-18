package com.nsbm.group_04.events.repository;

import com.nsbm.group_04.events.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {

    // Checks if a specific hall is already reserved for a specific date and time
    Optional<Event> findByHallNameAndBookingDateAndBookingTime(String hallName, LocalDate date, LocalTime time);
}