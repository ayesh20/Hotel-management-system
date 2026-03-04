package com.nsbm.group_04.Events.services.impl;

import com.nsbm.group_04.Events.entity.Event;
import com.nsbm.group_04.Events.repository.EventRepository;
import com.nsbm.group_04.Events.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Event createEvent(Event event) {
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

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    @Override
    public List<Event> getEventsByDate(LocalDate date) {
        return eventRepository.findByBookingDate(date);
    }

    @Override
    public List<Event> getEventsByHall(String hall) {
        return eventRepository.findByHallSelection(hall);
    }

    @Override
    public List<Event> getEventsByPaymentStatus(String paymentStatus) {
        return eventRepository.findByPaymentStatus(paymentStatus);
    }

    @Override
    public List<Event> getEventsByCustomerId(String customerId) {
        return eventRepository.findByCustomerId(customerId);
    }

    @Override
    public Event updateEvent(String id, Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(id);

        if (optionalEvent.isPresent()) {
            Event existingEvent = optionalEvent.get();

            boolean hallOrTimeChanged =
                    !existingEvent.getHallSelection().equals(eventDetails.getHallSelection()) ||
                            !existingEvent.getBookingDate().equals(eventDetails.getBookingDate()) ||
                            !existingEvent.getEventTime().equals(eventDetails.getEventTime());

            if (hallOrTimeChanged) {
                List<Event> conflicts = eventRepository.findByHallSelectionAndBookingDateAndEventTime(
                        eventDetails.getHallSelection(), eventDetails.getBookingDate(), eventDetails.getEventTime());

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

    @Override
    public void deleteEvent(String id) {
        Optional<Event> event = eventRepository.findById(id);
        if (event.isPresent()) {
            eventRepository.deleteById(id);
        } else {
            throw new RuntimeException("Event not found with id: " + id);
        }
    }

    @Override
    public Map<String, Object> getEventsDashboard() {
        List<Event> allEvents = eventRepository.findAll();

        long totalEvents = allEvents.size();
        long paidEvents = allEvents.stream()
                .filter(e -> "PAID".equalsIgnoreCase(e.getPaymentStatus()))
                .count();
        long pendingEvents = allEvents.stream()
                .filter(e -> "PENDING".equalsIgnoreCase(e.getPaymentStatus()))
                .count();
        long cancelledEvents = allEvents.stream()
                .filter(e -> "CANCELLED".equalsIgnoreCase(e.getEventStatus()))
                .count();

        Map<String, Long> bookingsPerHall = new HashMap<>();
        for (Event event : allEvents) {
            bookingsPerHall.merge(event.getHallSelection(), 1L, Long::sum);
        }

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalEvents", totalEvents);
        dashboard.put("paidEvents", paidEvents);
        dashboard.put("pendingPayments", pendingEvents);
        dashboard.put("cancelledEvents", cancelledEvents);
        dashboard.put("bookingsPerHall", bookingsPerHall);

        return dashboard;
    }
}