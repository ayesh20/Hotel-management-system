package com.nsbm.group_04.eventshandleservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {
    @Id
    private String id;
    private String personName; // Requirement: Booking person name
    private String personId;   // Requirement: Person ID
    private double paymentAmount; // Requirement: Payment amount
    private LocalDate bookingDate; // Requirement: Booking date
    private LocalTime startTime;   // Requirement: Booking time
    private LocalTime endTime;     // For double-booking logic
    private int participantCount;  // Requirement: People count
    private String hallName;       // Requirement: Hall selection
    private String status;         // Suggested: Lifecycle tracking
}
