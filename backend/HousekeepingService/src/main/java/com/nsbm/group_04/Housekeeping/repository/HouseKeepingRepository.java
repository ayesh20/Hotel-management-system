package com.nsbm.group_04.Housekeeping.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.nsbm.group_04.Housekeeping.entity.HouseKeeping;

@Repository
public interface HouseKeepingRepository
        extends MongoRepository<HouseKeeping, String> {


}

