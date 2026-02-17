package com.nsbm.group_04.Events.service;

import com.nsbm.group_04.Events.dto.EventDTO;
import com.nsbm.group_04.Events.model.Event;

import java.util.List;

public interface EventManagement {

    Event addEvent(EventDTO dto);
    Event updateEvent(String id, EventDTO dto);

    void deleteEvent(String id);

    List<Event> getAllEvents();
}
