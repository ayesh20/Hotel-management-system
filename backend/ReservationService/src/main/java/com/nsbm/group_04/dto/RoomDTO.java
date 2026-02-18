package com.nsbm.group_04.dto;

import java.time.LocalDateTime;

public class RoomDTO {
    // These fields must match the JSON keys exactly!
    private String id;
    private String roomNumber;
    private String roomSpecify;
    private String roomType;
    private Double price;
    private String status;
    // We can ignore createdAt/updatedAt if we don't need them

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomSpecify() { return roomSpecify; }
    public void setRoomSpecify(String roomSpecify) { this.roomSpecify = roomSpecify; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}