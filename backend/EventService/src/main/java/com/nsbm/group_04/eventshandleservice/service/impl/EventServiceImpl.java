package com.nsbm.group_04.eventshandleservice.service.impl;

import com.nsbm.group_04.eventshandleservice.model.Event;
import com.nsbm.group_04.eventshandleservice.repository.EventRepository;
import com.nsbm.group_04.eventshandleservice.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public String saveEvent(Event event) {
        // 1. Suggested: Capacity Validation
        if (event.getParticipantCount() > 500 && !event.getHallName().equalsIgnoreCase("Grand Ballroom")) {
            return "Error: Selected hall is too small for " + event.getParticipantCount() + " people.";
        }

        // 2. Requirement: Double Booking Prevention
        List<Event> overlaps = eventRepository.findOverlappingEvents(
                event.getHallName(), event.getBookingDate(), event.getStartTime(), event.getEndTime());

        if (!overlaps.isEmpty()) {
            return "Error: Double booking! This hall is occupied during the selected time.";
        }

        // 3. Suggested: Auto-Price Calculation
        long hours = Duration.between(event.getStartTime(), event.getEndTime()).toHours();
        event.setPaymentAmount(Math.max(1, hours) * 150.0); // Base rate of $150/hr

        event.setStatus("CONFIRMED");
        eventRepository.save(event);
        return "Event saved successfully with automatic pricing.";
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event getEventById(String id) {
        return eventRepository.findById(id).orElse(null);
    }

    @Override
    public String updateEvent(String id, Event event) {
        if (eventRepository.existsById(id)) {
            event.setId(id);
            eventRepository.save(event);
            return "Event updated.";
        }
        return "Event not found.";
    }

    @Override
    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
}