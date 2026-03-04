package com.nsbm.group_04.BookingTransportService.dto;

public class TransportBookingRequestDTO {

    private String customerId;
    private String vehicleId;
    private String fromLocation;
    private String toLocation;

    public TransportBookingRequestDTO() {}

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }
}