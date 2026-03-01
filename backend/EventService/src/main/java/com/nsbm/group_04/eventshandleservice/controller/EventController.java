package com.nsbm.group_04.eventshandleservice.controller;

import com.nsbm.group_04.eventshandleservice.model.Event;
import com.nsbm.group_04.eventshandleservice.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/add")
    public String addEvent(@RequestBody Event event) {
        return eventService.saveEvent(event);
    }

    @GetMapping("/all")
    public List<Event> getAll() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getById(@PathVariable String id) {
        return eventService.getEventById(id);
    }

    @PutMapping("/update/{id}")
    public String update(@PathVariable String id, @RequestBody Event event) {
        return eventService.updateEvent(id, event);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        eventService.deleteEvent(id);
    }
}