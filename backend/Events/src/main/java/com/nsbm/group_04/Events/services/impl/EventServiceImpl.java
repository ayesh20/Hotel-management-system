package com.nsbm.group_04.Events.services.impl;

import com.nsbm.group_04.Events.entity.Event;
import com.nsbm.group_04.Events.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventServiceImpl {

    @Autowired
    private EventRepository eventRepository;

    /**
     * Returns a summary/dashboard of all events grouped by hall
     * with booking counts and payment status overview.
     * Useful for monitoring and reporting.
     */
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

        // Count bookings per hall
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