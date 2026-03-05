package com.nsbm.group_04.BookingTransportService.repository;

import com.nsbm.group_04.BookingTransportService.entity.TransportBooking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransportBookingRepository
        extends MongoRepository<TransportBooking, String> {

}