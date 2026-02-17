package com.nsbm.group_04.Events.repository;

import com.nsbm.group_04.Events.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository extends MongoRepository<Event,String> {

}
