package com.nsbm.group_04.events.service.impl;

import com.nsbm.group_04.events.entity.Event;
import com.nsbm.group_04.events.repository.EventRepository;
import com.nsbm.group_04.events.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Event addEvent(Event event) {
        // Double Booking Prevention Logic
        boolean isAlreadyBooked = eventRepository.findByHallNameAndBookingDateAndBookingTime(
                event.getHallName(),
                event.getBookingDate(),
                event.getBookingTime()
        ).isPresent();

        if (isAlreadyBooked) {
            throw new RuntimeException("Validation Error: Hall '" + event.getHallName() +
                    "' is already booked for " + event.getBookingDate() +
                    " at " + event.getBookingTime());
        }

        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(String id, Event updatedEvent) {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        existingEvent.setCustomerName(updatedEvent.getCustomerName());
        existingEvent.setEventType(updatedEvent.getEventType());
        existingEvent.setBookingDate(updatedEvent.getBookingDate());
        existingEvent.setBookingTime(updatedEvent.getBookingTime());
        existingEvent.setHallName(updatedEvent.getHallName());
        existingEvent.setPaymentAmount(updatedEvent.getPaymentAmount());

        return eventRepository.save(existingEvent);
    }

    @Override
    public void deleteEvent(String id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Delete failed: No event found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }
}