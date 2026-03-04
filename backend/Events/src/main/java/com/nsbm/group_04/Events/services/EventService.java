package com.nsbm.group_04.Events.services;

import com.nsbm.group_04.Events.entity.Event;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface EventService {

    Event createEvent(Event event);

    List<Event> getAllEvents();

    Event getEventById(String id);

    List<Event> getEventsByDate(LocalDate date);

    List<Event> getEventsByHall(String hall);

    List<Event> getEventsByPaymentStatus(String paymentStatus);

    List<Event> getEventsByCustomerId(String customerId);

    Event updateEvent(String id, Event eventDetails);

    void deleteEvent(String id);

    Map<String, Object> getEventsDashboard();
}
