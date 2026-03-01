package com.nsbm.group_04.eventshandleservice.service;

import com.nsbm.group_04.eventshandleservice.model.Event;
import java.util.List;

public interface EventService {
    String saveEvent(Event event);
    List<Event> getAllEvents();
    Event getEventById(String id);
    String updateEvent(String id, Event event);
    void deleteEvent(String id);
}