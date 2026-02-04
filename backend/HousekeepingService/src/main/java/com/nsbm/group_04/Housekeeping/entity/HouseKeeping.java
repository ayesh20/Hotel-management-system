package com.nsbm.group_04.Housekeeping.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;


@Document(collection = "housekeeping")
public class HouseKeeping {

    @Id
    private String id;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotBlank(message = "Staff ID is required")
    private String staffId;

    @NotBlank(message = "Cleaning date is required")
    private String cleaningDate;

    @NotBlank(message = "Status is required")
    private String status;   // PENDING, IN_PROGRESS, COMPLETED

    private String remarks;  // optional

    // No-argument constructor
    public HouseKeeping() {
    }

    // Parameterized constructor
    public HouseKeeping(String roomNumber,
                        String staffId,
                        String cleaningDate,
                        String status,
                        String remarks) {
        this.roomNumber = roomNumber;
        this.staffId = staffId;
        this.cleaningDate = cleaningDate;
        this.status = status;
        this.remarks = remarks;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getCleaningDate() {
        return cleaningDate;
    }

    public void setCleaningDate(String cleaningDate) {
        this.cleaningDate = cleaningDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
