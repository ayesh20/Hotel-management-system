package com.nsbm.group_04.Events.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Document(collection = "eventsdata")
public class Event {

    @Id
    private String id;

    @Field("customer_name")
    @NotBlank(message = "Customer name is required")
    private String customerName;

    @Field("customer_id")
    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @Field("booking_date")
    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @Field("event_time")
    @NotNull(message = "Event time is required")
    private LocalTime eventTime;

    @Field("people_count")
    @NotNull(message = "People count is required")
    @Positive(message = "People count must be positive")
    private Integer peopleCount;

    @Field("payment_status")
    @NotBlank(message = "Payment status is required")
    private String paymentStatus;

    @Field("hall_selection")
    @NotBlank(message = "Hall selection is required")
    private String hallSelection;

    @Field("event_status")
    private String eventStatus;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    public Event() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.eventStatus = "CONFIRMED";
        this.paymentStatus = "PENDING";
    }

    public Event(String customerName, String customerId, LocalDate bookingDate,
                 LocalTime eventTime, Integer peopleCount, String paymentStatus, String hallSelection) {
        this.customerName = customerName;
        this.customerId = customerId;
        this.bookingDate = bookingDate;
        this.eventTime = eventTime;
        this.peopleCount = peopleCount;
        this.paymentStatus = paymentStatus;
        this.hallSelection = hallSelection;
        this.eventStatus = "CONFIRMED";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; this.updatedAt = LocalDateTime.now(); }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; this.updatedAt = LocalDateTime.now(); }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; this.updatedAt = LocalDateTime.now(); }

    public LocalTime getEventTime() { return eventTime; }
    public void setEventTime(LocalTime eventTime) { this.eventTime = eventTime; this.updatedAt = LocalDateTime.now(); }

    public Integer getPeopleCount() { return peopleCount; }
    public void setPeopleCount(Integer peopleCount) { this.peopleCount = peopleCount; this.updatedAt = LocalDateTime.now(); }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; this.updatedAt = LocalDateTime.now(); }

    public String getHallSelection() { return hallSelection; }
    public void setHallSelection(String hallSelection) { this.hallSelection = hallSelection; this.updatedAt = LocalDateTime.now(); }

    public String getEventStatus() { return eventStatus; }
    public void setEventStatus(String eventStatus) { this.eventStatus = eventStatus; this.updatedAt = LocalDateTime.now(); }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Event{" +
                "id='" + id + '\'' +
                ", customerName='" + customerName + '\'' +
                ", customerId='" + customerId + '\'' +
                ", bookingDate=" + bookingDate +
                ", eventTime=" + eventTime +
                ", peopleCount=" + peopleCount +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", hallSelection='" + hallSelection + '\'' +
                ", eventStatus='" + eventStatus + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}