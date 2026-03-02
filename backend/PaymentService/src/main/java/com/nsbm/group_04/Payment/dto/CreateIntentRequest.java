package com.nsbm.group_04.Payment.dto;

import lombok.Data;

@Data
public class CreateIntentRequest {
    private Long amount; // amount in cents
    private String currency; // e.g. "usd"
    private String description;
}
