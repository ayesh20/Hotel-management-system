package com.nsbm.group_04.Payment.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    @GetMapping("/payment/test")
    public String testPayment() {
        return "Payment Service is working!";
    }
}
