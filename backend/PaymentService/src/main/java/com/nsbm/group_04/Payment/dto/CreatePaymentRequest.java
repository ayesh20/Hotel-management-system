package com.nsbm.group_04.Payment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePaymentRequest {

    @NotNull
    private String bookingId;

    @NotNull
    private String customerId;

    @NotNull
    private Long amount; // in cents e.g., 5000 = R50/R50.00

    private String currency; // LKR

    private Long discountAmount;

    @NotNull
    private String description;
}
