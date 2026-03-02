package com.nsbm.group_04.Payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentIntentResponse {

    private String id;
    private String clientSecret;
    private Long amount;
    private String currency;
    private String status;
}