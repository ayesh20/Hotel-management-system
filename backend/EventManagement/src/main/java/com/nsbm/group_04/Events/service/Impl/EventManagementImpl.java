package com.nsbm.group_04.Events.service.Impl;

import com.nsbm.group_04.Events.dto.EventDTO;
import com.nsbm.group_04.Events.model.Event;
import com.nsbm.group_04.Events.repository.EventRepository;
import com.nsbm.group_04.Events.service.EventManagement;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventManagementImpl implements EventManagement {

    private final EventRepository repository;

    public EventManagementImpl(EventRepository repository) {
        this.repository = repository;
    }

    @Override
    public Event addEvent(EventDTO dto) {

        // Validate hall selection
        if (!dto.getHallName().equalsIgnoreCase("Hall A") &&
                !dto.getHallName().equalsIgnoreCase("Hall B") &&
                !dto.getHallName().equalsIgnoreCase("Hall C")) {

            throw new RuntimeException("Invalid hall selected!");
        }

        Event event = new Event();
        event.setCustomerName(dto.getCustomerName());
        event.setMobileNumber(dto.getMobileNumber());
        event.setCustomerIdNumber(dto.getCustomerIdNumber());
        event.setBookingDate(dto.getBookingDate());
        event.setBookingTime(dto.getBookingTime());
        event.setEventType(dto.getEventType());
        event.setNumberOfPeople(dto.getNumberOfPeople());
        event.setAdvancedAmount(dto.getAdvancedAmount());
        event.setHallName(dto.getHallName());

        return repository.save(event);
    }

    @Override
    public Event updateEvent(String id, EventDTO dto) {

        Event event = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setCustomerName(dto.getCustomerName());
        event.setMobileNumber(dto.getMobileNumber());
        event.setCustomerIdNumber(dto.getCustomerIdNumber());
        event.setBookingDate(dto.getBookingDate());
        event.setBookingTime(dto.getBookingTime());
        event.setEventType(dto.getEventType());
        event.setNumberOfPeople(dto.getNumberOfPeople());
        event.setAdvancedAmount(dto.getAdvancedAmount());
        event.setHallName(dto.getHallName());

        return repository.save(event);
    }

    @Override
    public void deleteEvent(String id) {
        repository.deleteById(id);
    }

    @Override
    public List<Event> getAllEvents() {
        return repository.findAll();
    }
}
