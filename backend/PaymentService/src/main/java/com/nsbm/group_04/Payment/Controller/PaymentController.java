package com.nsbm.group_04.Payment.Controller;

import com.nsbm.group_04.Payment.entity.Payment;
import com.nsbm.group_04.Payment.services.PaymentService;
import com.nsbm.group_04.Payment.dto.CreatePaymentRequest;
import com.nsbm.group_04.Payment.services.StripePaymentService;
import com.stripe.model.PaymentIntent;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;       // Your MongoDB service

    @Autowired
    private StripePaymentService stripeService;   // Stripe service

    //Create Stripe PaymentIntent and save in DB
    @PostMapping("/pay")
    public ResponseEntity<Payment> createPayment(@RequestBody CreatePaymentRequest request) {
        try {
            //Create Stripe PaymentIntent
            PaymentIntent intent = stripeService.createPayment(request);

            //Create Payment object to save in DB
            Payment payment = new Payment();
            payment.setBookingId(request.getBookingId());
            payment.setCustomerId(request.getCustomerId());
            payment.setAmount(request.getAmount());
            payment.setDiscountAmount(request.getDiscountAmount());
            payment.calculateFinalAmount();                   // optional
            payment.setPaymentMethod("CARD");
            payment.setPaymentStatus("PENDING");             // initially
            payment.setCurrency(request.getCurrency());
            payment.setStripePaymentIntentId(intent.getId()); // Stripe reference
            payment.setPaymentDate(new Date());

            //Save to MongoDB
            Payment savedPayment = paymentService.createPayment(payment);

            return ResponseEntity.ok(savedPayment);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    //Get all payments
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    //Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Update payment status (after Stripe confirms)
    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable String id, @RequestParam String status) {
        Payment updated = paymentService.updatePaymentStatus(id, status);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    // Delete payment
    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable String id) {
        paymentService.deletePayment(id);
    }
}