package com.nsbm.group_04.Rooms.repository;

import com.nsbm.group_04.Rooms.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface RoomRepository extends MongoRepository<Room, String> {


}