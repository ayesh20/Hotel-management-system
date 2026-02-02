package com.nsbm.group_04.Rooms.services;

import com.nsbm.group_04.Rooms.entity.Room;
import com.nsbm.group_04.Rooms.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class RoomServices {

    @Autowired
    private RoomRepository roomRepository;


    public Room createRoom(Room room) {

        // Set timestamps
        room.setCreatedAt(LocalDateTime.now());
        room.setUpdatedAt(LocalDateTime.now());

        // Save and return
        return roomRepository.save(room);
    }



}