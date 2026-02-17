package com.nsbm.group_04.events.service;

import com.nsbm.group_04.events.entity.Event;
import java.util.List;

public interface EventService {
    Event addEvent(Event event);
    Event updateEvent(String id, Event event);
    void deleteEvent(String id);
    List<Event> getAllEvents();
    Event getEventById(String id);
}