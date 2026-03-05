package com.nsbm.group_04.Housekeeping.services.impl;

import com.nsbm.group_04.Housekeeping.DTO.RoomDTO;
import com.nsbm.group_04.Housekeeping.DTO.StaffDTO;
import com.nsbm.group_04.Housekeeping.DTO.StaffResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HouseKeepingImpl {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String ROOM_SERVICE_URL = "http://13.61.186.105:8081/api/rooms/all";
    private final String STAFF_SERVICE_URL = "http://13.212.196.133:8083/api/staff";

    public List<RoomDTO> getRoomNumbers() {
        RoomDTO[] rooms = restTemplate.getForObject(ROOM_SERVICE_URL, RoomDTO[].class);
        return Arrays.asList(rooms);
    }

    public List<StaffDTO> getCleaners(String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<StaffResponse> response = restTemplate.exchange(
                STAFF_SERVICE_URL,
                HttpMethod.GET,
                entity,
                StaffResponse.class
        );

        StaffDTO[] staff = response.getBody().getData(); // <-- now you get the array safely

        return Arrays.stream(staff)
                .filter(s -> s.getRole() != null &&
                        s.getRole().toLowerCase().contains("clean"))
                .toList();


    }
}