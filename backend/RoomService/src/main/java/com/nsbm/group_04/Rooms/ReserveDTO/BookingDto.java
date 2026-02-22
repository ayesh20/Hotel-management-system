package com.nsbm.group_04.Rooms.ReserveDTO;

public class BookingDto {

    private String roomNumber;
    private String status;

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}