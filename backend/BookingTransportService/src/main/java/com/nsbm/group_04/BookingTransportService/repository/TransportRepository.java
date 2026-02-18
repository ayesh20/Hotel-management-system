package com.nsbm.group_04.BookingTransportService.repository;

import com.nsbm.group_04.BookingTransportService.entity.Transport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransportRepository extends MongoRepository<Transport, String> {
}

