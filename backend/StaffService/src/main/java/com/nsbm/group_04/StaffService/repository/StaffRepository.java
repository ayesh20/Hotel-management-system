package com.nsbm.group_04.StaffService.repository;

import com.nsbm.group_04.StaffService.entity.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {

}
