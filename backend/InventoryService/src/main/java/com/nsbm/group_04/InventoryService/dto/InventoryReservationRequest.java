package com.nsbm.group_04.InventoryService.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class InventoryReservationRequest
{
    private String eventId;
    private String hallName;
    private Integer attendees;
    private LocalDate bookingDate;
    private LocalTime bookingTime;

    // Getters & Setters
    public String getEventId()
    {
        return eventId;
    }
    public void setEventId(String eventId)
    {
        this.eventId = eventId;
    }
    public String getHallName()
    {
        return hallName;
    }
    public void setHallName(String hallName)
    {
        this.hallName = hallName;
    }
    public Integer getAttendees() {
        return attendees;
    }
    public void setAttendees(Integer attendees)
    {
        this.attendees = attendees;
    }
    public LocalDate getBookingDate()
    {
        return bookingDate;
    }
    public void setBookingDate(LocalDate bookingDate)
    {
        this.bookingDate = bookingDate;
    }
    public LocalTime getBookingTime()
    {
        return bookingTime;
    }
    public void setBookingTime(LocalTime bookingTime)
    {
        this.bookingTime = bookingTime;
    }
}

