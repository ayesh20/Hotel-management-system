package com.nsbm.group_04.Events.controller;

import com.nsbm.group_04.Events.entity.Event;
import com.nsbm.group_04.Events.services.EventServices;
import com.nsbm.group_04.Events.services.impl.EventServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/events")
@CrossOrigin(origins = {"http://localhost:5173"},
        allowCredentials = "true",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
                RequestMethod.DELETE, RequestMethod.OPTIONS})
public class EventController {

    @Autowired
    private EventServices eventServices;       // handles create, update, delete, getById

    @Autowired
    private EventServiceImpl eventServiceImpl; // handles dashboard/monitoring logic

    @PostMapping("/add")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            Event createdEvent = eventServices.createEvent(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        try {
            List<Event> events = eventServices.getAllEvents();
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        try {
            Event event = eventServices.getEventById(id);
            return new ResponseEntity<>(event, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Monitor: get events by date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Event>> getEventsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<Event> events = eventServices.getEventsByDate(date);
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Monitor: get events by hall
    @GetMapping("/hall/{hall}")
    public ResponseEntity<List<Event>> getEventsByHall(@PathVariable String hall) {
        try {
            List<Event> events = eventServices.getEventsByHall(hall);
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Monitor: get events by payment status
    @GetMapping("/payment/{status}")
    public ResponseEntity<List<Event>> getEventsByPaymentStatus(@PathVariable String status) {
        try {
            List<Event> events = eventServices.getEventsByPaymentStatus(status);
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Monitor: get events by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Event>> getEventsByCustomerId(@PathVariable String customerId) {
        try {
            List<Event> events = eventServices.getEventsByCustomerId(customerId);
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Dashboard / analytics overview
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getEventsDashboard() {
        try {
            Map<String, Object> dashboard = eventServiceImpl.getEventsDashboard();
            return new ResponseEntity<>(dashboard, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable String id, @RequestBody Event event) {
        try {
            Event updatedEvent = eventServices.updateEvent(id, event);
            return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        try {
            eventServices.deleteEvent(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
