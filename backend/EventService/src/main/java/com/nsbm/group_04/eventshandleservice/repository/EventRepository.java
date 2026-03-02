package com.nsbm.group_04.eventshandleservice.repository;

import com.nsbm.group_04.eventshandleservice.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends MongoRepository<Event, String> {

    Optional<Event> findByHallNumberAndEventDateAndEventTime(
            String hallNumber,
            LocalDate eventDate,
            LocalTime eventTime
    );

    List<Event> findByEventDate(LocalDate eventDate);
}