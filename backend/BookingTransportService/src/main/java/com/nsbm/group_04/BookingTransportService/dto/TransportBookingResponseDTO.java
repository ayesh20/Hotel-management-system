package com.nsbm.group_04.BookingTransportService.dto;

import java.time.LocalDate;

public class TransportBookingResponseDTO {

    private String bookingId;
    private String customerName;
    private String vehicleType;
    private double pricePerDay;
    private String fromLocation;
    private String toLocation;
    private String status;
    private LocalDate bookingDate;

    public TransportBookingResponseDTO() {}

    // getters and setters

    public String getBookingId() {
        return bookingId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public String getFromLocation() {
        return fromLocation;
    }

    public String getToLocation() {
        return toLocation;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public void setFromLocation(String fromLocation) {
        this.fromLocation = fromLocation;
    }

    public void setToLocation(String toLocation) {
        this.toLocation = toLocation;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }
}