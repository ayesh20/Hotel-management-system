package com.nsbm.group_04.Events.services;

import com.nsbm.group_04.Events.entity.Event;
import com.nsbm.group_04.Events.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventServices {

    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(Event event) {
        // Double-booking check: same hall, same date, same time
        List<Event> conflicts = eventRepository.findByHallSelectionAndBookingDateAndEventTime(
                event.getHallSelection(), event.getBookingDate(), event.getEventTime());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Hall '" + event.getHallSelection() +
                    "' is already booked on " + event.getBookingDate() +
                    " at " + event.getEventTime());
        }

        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public List<Event> getEventsByDate(LocalDate date) {
        return eventRepository.findByBookingDate(date);
    }

    public List<Event> getEventsByHall(String hall) {
        return eventRepository.findByHallSelection(hall);
    }

    public List<Event> getEventsByPaymentStatus(String paymentStatus) {
        return eventRepository.findByPaymentStatus(paymentStatus);
    }

    public List<Event> getEventsByCustomerId(String customerId) {
        return eventRepository.findByCustomerId(customerId);
    }

    public Event updateEvent(String id, Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(id);

        if (optionalEvent.isPresent()) {
            Event existingEvent = optionalEvent.get();

            // Double-booking check only if hall/date/time is being changed
            boolean hallOrTimeChanged =
                    !existingEvent.getHallSelection().equals(eventDetails.getHallSelection()) ||
                            !existingEvent.getBookingDate().equals(eventDetails.getBookingDate()) ||
                            !existingEvent.getEventTime().equals(eventDetails.getEventTime());

            if (hallOrTimeChanged) {
                List<Event> conflicts = eventRepository.findByHallSelectionAndBookingDateAndEventTime(
                        eventDetails.getHallSelection(), eventDetails.getBookingDate(), eventDetails.getEventTime());

                // Filter out the current event itself from conflicts
                conflicts.removeIf(e -> e.getId().equals(id));

                if (!conflicts.isEmpty()) {
                    throw new RuntimeException("Hall '" + eventDetails.getHallSelection() +
                            "' is already booked on " + eventDetails.getBookingDate() +
                            " at " + eventDetails.getEventTime());
                }
            }

            existingEvent.setCustomerName(eventDetails.getCustomerName());
            existingEvent.setCustomerId(eventDetails.getCustomerId());
            existingEvent.setBookingDate(eventDetails.getBookingDate());
            existingEvent.setEventTime(eventDetails.getEventTime());
            existingEvent.setPeopleCount(eventDetails.getPeopleCount());
            existingEvent.setPaymentStatus(eventDetails.getPaymentStatus());
            existingEvent.setHallSelection(eventDetails.getHallSelection());
            existingEvent.setEventStatus(eventDetails.getEventStatus());
            existingEvent.setUpdatedAt(LocalDateTime.now());

            return eventRepository.save(existingEvent);
        } else {
            throw new RuntimeException("Event not found with id: " + id);
        }
    }

    public void deleteEvent(String id) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isPresent()) {
            eventRepository.deleteById(id);
        } else {
            throw new RuntimeException("Event not found with id: " + id);
        }
    }
}
