package com.nsbm.group_04.BookingTransportService.repository;

import com.nsbm.group_04.BookingTransportService.entity.Transport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransportRepository extends MongoRepository<Transport, String> {
    List<Transport> findByStatus(String status);
}

