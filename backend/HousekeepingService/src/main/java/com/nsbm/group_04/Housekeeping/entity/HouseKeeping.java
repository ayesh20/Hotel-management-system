package com.nsbm.group_04.Housekeeping.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "housekeeping")
public class HouseKeeping {

    @Id
    private String id;

    private String roomNumber;
    private String staffId;
    private String cleaningDate;
    private String status;
    private String remarks;

    public HouseKeeping() {
    }

    public HouseKeeping(String roomNumber, String staffId, String cleaningDate, String status, String remarks) {
        this.roomNumber = roomNumber;
        this.staffId = staffId;
        this.cleaningDate = cleaningDate;
        this.status = status;
        this.remarks = remarks;
    }

    public String getId() {
        return id;
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
