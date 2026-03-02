package com.nsbm.group_04.eventshandleservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "events")
public class Event {

    @Id
    private String id;

    private String personId;
    private String personName;

    private String hallNumber;
    private int peopleCount;

    private String paymentStatus; // FULL or PARTIAL

    private LocalDate eventDate;
    private LocalTime eventTime;

    private String status; // BOOKED, CANCELLED

    public Event() {
    }

    public Event(String personId, String personName, String hallNumber,
                 int peopleCount, String paymentStatus,
                 LocalDate eventDate, LocalTime eventTime, String status) {
        this.personId = personId;
        this.personName = personName;
        this.hallNumber = hallNumber;
        this.peopleCount = peopleCount;
        this.paymentStatus = paymentStatus;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.status = status;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPersonId() {
        return personId;
    }

    public void setPersonId(String personId) {
        this.personId = personId;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getHallNumber() {
        return hallNumber;
    }

    public void setHallNumber(String hallNumber) {
        this.hallNumber = hallNumber;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public int getPeopleCount() {
        return peopleCount;
    }

    public void setPeopleCount(int peopleCount) {
        this.peopleCount = peopleCount;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public LocalTime getEventTime() {
        return eventTime;
    }

    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}