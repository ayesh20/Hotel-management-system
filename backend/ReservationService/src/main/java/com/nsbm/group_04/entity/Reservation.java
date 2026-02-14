package com.nsbm.group_04.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "reservations") // This is like 'mongoose.model'
public class Reservation {

    @Id
    private String id; // MongoDB uses String IDs (ObjectIds)
    private String customerName;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalPrice;

    // Constructors
    public Reservation() {}

    public Reservation(String customerName, String roomType, LocalDate checkInDate, LocalDate checkOutDate, Double totalPrice) {
        this.customerName = customerName;
        this.roomType = roomType;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters (IntelliJ can generate these: Alt + Insert)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
}