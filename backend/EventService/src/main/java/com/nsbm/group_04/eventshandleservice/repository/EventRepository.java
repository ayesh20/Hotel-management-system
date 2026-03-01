package com.nsbm.group_04.eventshandleservice.repository;

import com.nsbm.group_04.eventshandleservice.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    // Logic: Find events in the same hall on the same day with overlapping times
    @Query("{ 'hallName': ?0, 'bookingDate': ?1, " +
            "  $or: [ " +
            "    { 'startTime': { $lt: ?3 }, 'endTime': { $gt: ?2 } } " +
            "  ] " +
            "}")
    List<Event> findOverlappingEvents(String hallName, LocalDate date, LocalTime start, LocalTime end);
}