package com.nsbm.group_04.BookingTransportService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transport_vehicles")
public class Transport {

    @Id
    private String id;

    private String vehicleType;      // Car, Van
    private String vehicleNumber;
    private String driverName;
    private String driverContact;
    private double pricePerDay;
    private String status;            // AVAILABLE, BOOKED


    // Constructors
    public Transport() {
    }

    public Transport(String vehicleType, String vehicleNumber, String driverName,
                     String driverContact, double pricePerDay, String status) {
        this.vehicleType = vehicleType;
        this.vehicleNumber = vehicleNumber;
        this.driverName = driverName;
        this.driverContact = driverContact;
        this.pricePerDay = pricePerDay;
        this.status = status;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverContact() {
        return driverContact;
    }

    public void setDriverContact(String driverContact) {
        this.driverContact = driverContact;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

