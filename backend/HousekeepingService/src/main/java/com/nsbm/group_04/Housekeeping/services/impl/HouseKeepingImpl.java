package com.nsbm.group_04.Housekeeping.services.impl;

import com.nsbm.group_04.Housekeeping.DTO.RoomDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class HouseKeepingImpl {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String ROOM_SERVICE_URL = "http://13.61.186.105:8081/api/rooms/all";

    public List<RoomDTO> getRoomNumbers() {

        RoomDTO[] rooms = restTemplate.getForObject(ROOM_SERVICE_URL, RoomDTO[].class);

        return Arrays.asList(rooms);
    }
}