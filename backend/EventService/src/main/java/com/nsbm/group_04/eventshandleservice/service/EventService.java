package com.nsbm.group_04.eventshandleservice.service;

import com.nsbm.group_04.eventshandleservice.model.Event;

import java.time.LocalDate;
import java.util.List;

public interface EventService {

    Event createEvent(Event event);

    Event updateEvent(String id, Event event);

    void deleteEvent(String id);

    Event getEventById(String id);

    List<Event> getAllEvents();

    List<Event> monitorEventsByDate(LocalDate date);
}