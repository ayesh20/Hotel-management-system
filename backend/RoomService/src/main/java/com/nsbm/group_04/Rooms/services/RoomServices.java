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

        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }


    public Room updateRoom(String id, Room roomDetails) {
        Optional<Room> optionalRoom = roomRepository.findById(id);

        if (optionalRoom.isPresent()) {
            Room existingRoom = optionalRoom.get();

            existingRoom.setRoomNumber(roomDetails.getRoomNumber());
            existingRoom.setRoomSpecify(roomDetails.getRoomSpecify());
            existingRoom.setPrice(roomDetails.getPrice());
            existingRoom.setRoomType(roomDetails.getRoomType());
            existingRoom.setStatus(roomDetails.getStatus());
            existingRoom.setUpdatedAt(LocalDateTime.now());

            return roomRepository.save(existingRoom);
        } else {
            throw new RuntimeException("Room not found with id: " + id);
        }
    }
    public void deleteRoom(String id) {
        Optional<Room> room = roomRepository.findById(id);

        if (room.isPresent()) {
            roomRepository.deleteById(id);
        } else {
            throw new RuntimeException("Room not found with id: " + id);
        }
    }


}