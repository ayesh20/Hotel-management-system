package com.nsbm.group_04.InventoryService.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventReservationDTO
{
    private String eventId;
    private String hallName;
    private Integer peopleCount;
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
    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer attendees)
    {
        this.peopleCount = attendees;
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

