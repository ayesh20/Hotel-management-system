package com.nsbm.group_04.repository;

import com.nsbm.group_04.entity.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    // That's it! Spring implements this automatically at runtime.
    // If you need custom queries later, you can add them here.
}