package com.nsbm.group_04.eventshandleservice.service.impl;

import com.nsbm.group_04.eventshandleservice.model.Event;
import com.nsbm.group_04.eventshandleservice.repository.EventRepository;
import com.nsbm.group_04.eventshandleservice.service.EventService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public Event createEvent(Event event) {

        // Prevent double booking
        eventRepository
                .findByHallNumberAndEventDateAndEventTime(
                        event.getHallNumber(),
                        event.getEventDate(),
                        event.getEventTime())
                .ifPresent(existing -> {
                    throw new RuntimeException("Hall already booked at this date and time!");
                });

        event.setStatus("BOOKED");

        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(String id, Event event) {

        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        existingEvent.setPersonId(event.getPersonId());
        existingEvent.setPersonName(event.getPersonName());
        existingEvent.setHallNumber(event.getHallNumber());
        existingEvent.setPeopleCount(event.getPeopleCount());
        existingEvent.setPaymentStatus(event.getPaymentStatus());
        existingEvent.setEventDate(event.getEventDate());
        existingEvent.setEventTime(event.getEventTime());

        return eventRepository.save(existingEvent);
    }

    @Override
    public void deleteEvent(String id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus("CANCELLED");
        eventRepository.save(event);
    }

    @Override
    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> monitorEventsByDate(LocalDate date) {
        return eventRepository.findByEventDate(date);
    }
}