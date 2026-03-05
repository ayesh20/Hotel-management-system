package com.nsbm.group_04.BookingTransportService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nsbm.group_04.BookingTransportService.entity.Transport;
import com.nsbm.group_04.BookingTransportService.service.TransportService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/transports")
public class TransportController {

    @Autowired
    private TransportService transportService;

    // Create vehicle
    @PostMapping("/add")
    public Transport addTransport(@RequestBody Transport transport) {
        return transportService.addTransport(transport);
    }

    // Read all vehicles
    @GetMapping
    public List<Transport> getAllTransports() {
        return transportService.getAllTransports();
    }


    @GetMapping("/{id}")
    public Transport getTransportById(@PathVariable String id) {
        return transportService.getTransportById(id);
    }

    @PutMapping("/{id}")
    public Transport updateTransport(
            @PathVariable String id,
            @RequestBody Transport transport) {

        return transportService.updateTransport(id, transport);
    }

    @DeleteMapping("/{id}")
    public void deleteTransport(@PathVariable String id) {
        transportService.deleteTransport(id);
    }


}
