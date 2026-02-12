package com.nsbm.group_04.Housekeeping.repository;

import com.nsbm.group_04.Housekeeping.entity.HouseKeeping;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HouseKeepingRepository extends MongoRepository<HouseKeeping, String> {
}
