package com.nsbm.group_04.BookingTransportService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nsbm.group_04.BookingTransportService.entity.Transport;
import com.nsbm.group_04.BookingTransportService.service.TransportService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/transport")
public class TransportController {

    @Autowired
    private TransportService transportService;

    // Create vehicle
    @PostMapping
    public Transport addTransport(@RequestBody Transport transport) {
        return transportService.addTransport(transport);
    }
}
