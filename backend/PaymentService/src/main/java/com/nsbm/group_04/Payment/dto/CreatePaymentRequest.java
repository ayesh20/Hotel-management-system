package com.nsbm.group_04.Payment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePaymentRequest {

    @NotNull
    private Long amount; // in cents e.g., 5000 = R50/R50.00

    @NotNull
    private String currency; // usd, zar

    @NotNull
    private String description;
}
