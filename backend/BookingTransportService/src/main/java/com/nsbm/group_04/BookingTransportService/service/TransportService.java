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

    public List<Transport> getAllTransports() {
        return transportRepository.findAll();
    }

    public Transport getTransportById(String id) {
        return transportRepository.findById(id).orElse(null);
    }

    public Transport updateTransport(String id, Transport updatedTransport) {
        Transport existing = transportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        existing.setVehicleType(updatedTransport.getVehicleType());
        existing.setVehicleNumber(updatedTransport.getVehicleNumber());
        existing.setDriverName(updatedTransport.getDriverName());
        existing.setDriverContact(updatedTransport.getDriverContact());
        existing.setPricePerDay(updatedTransport.getPricePerDay());
        existing.setStatus(updatedTransport.getStatus());


        return transportRepository.save(existing);
    }


    public void deleteTransport(String id) {
        transportRepository.deleteById(id);
    }

}
