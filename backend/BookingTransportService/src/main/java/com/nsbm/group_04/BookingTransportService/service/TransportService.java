package com.nsbm.group_04.BookingTransportService.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nsbm.group_04.BookingTransportService.entity.Transport;
import com.nsbm.group_04.BookingTransportService.repository.TransportRepository;

@Service
public class TransportService {

    @Autowired
    private TransportRepository transportRepository;

    // Register vehicle
    public Transport addTransport(Transport transport) {
        transport.setStatus("AVAILABLE");
        return transportRepository.save(transport);
    }

}
