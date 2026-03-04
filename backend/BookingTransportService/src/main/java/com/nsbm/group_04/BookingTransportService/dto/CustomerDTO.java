package com.nsbm.group_04.BookingTransportService.dto;

public class CustomerDTO {

    private String id;
    private String fullName;
    private String email;

    public CustomerDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}