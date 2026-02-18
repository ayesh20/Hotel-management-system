package com.nsbm.group_04.events.entity;

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
    private String customerId;
    private String customerName;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String eventType;
    private String hallName;
    private Double paymentAmount;
}