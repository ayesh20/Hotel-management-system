package com.nsbm.group_04.Rooms.Controller;

import com.nsbm.group_04.Rooms.entity.Room;
import com.nsbm.group_04.Rooms.services.RoomServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value="/api/rooms")
@CrossOrigin(origins = {"http://localhost:5173"},
        allowCredentials = "true",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class RoomController {

    @Autowired
    private RoomServices roomService;

    @PostMapping("/add")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room createdRoom = roomService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }


}