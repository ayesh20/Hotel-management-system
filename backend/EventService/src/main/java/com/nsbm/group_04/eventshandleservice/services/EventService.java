package com.nsbm.group_04.eventshandleservice.services;

import com.nsbm.group_04.eventshandleservice.entity.Event;
import com.nsbm.group_04.eventshandleservice.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Event createEvent(Event event) {
        event.setCreatedAt(LocalDateTime.now());
        return repository.save(event);
    }

    // READ - all events
    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    // READ - single event by id
    public Event getEventById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    // UPDATE event
    public Event updateEvent(String id, Event event) {
        Event existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        existing.setEventName(event.getEventName());
        existing.setEventDate(event.getEventDate());
        existing.setLocation(event.getLocation());
        existing.setDescription(event.getDescription());

        return repository.save(existing);
    }

    // DELETE event
    public void deleteEvent(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        repository.deleteById(id);
    }

    // MONITOR events by date
    public List<Event> monitorEventsByDate(LocalDate date) {
        return repository.findByEventDate(date);
    }
}