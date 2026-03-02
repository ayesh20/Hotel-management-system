package com.nsbm.group_04.Payment.Controller;

import com.nsbm.group_04.Payment.entity.Payment;
import com.nsbm.group_04.Payment.dto.CreatePaymentRequest;
import com.nsbm.group_04.Payment.dto.CreateIntentRequest;
import com.nsbm.group_04.Payment.dto.PaymentIntentResponse;
import com.nsbm.group_04.Payment.service.PaymentService;
import com.stripe.model.PaymentIntent;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // ─── Cash Payment ───────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Payment> createCashPayment(@RequestBody Map<String, Object> request) {
        try {
            Payment payment = new Payment();
            payment.setCustomerName((String) request.get("customerName"));
            payment.setPhoneNumber((String) request.get("phoneNumber"));
            payment.setCustomerId((String) request.get("customerId"));
            payment.setBookingId((String) request.get("bookingId"));
            payment.setAmount(((Number) request.get("amount")).doubleValue());
            payment.setDiscountAmount(((Number) request.get("discountAmount")).doubleValue());
            payment.setFinalAmount(((Number) request.get("totalAmount")).doubleValue());
            payment.setPaymentMethod("CASH");
            payment.setPaymentStatus("PENDING");
            payment.setPaymentDate(new Date());

            Payment savedPayment = paymentService.createPayment(payment);
            return ResponseEntity.ok(savedPayment);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ─── Stripe: Create PaymentIntent (returns clientSecret) ────────
    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(@RequestBody CreateIntentRequest request) {
        try {
            PaymentIntent intent = paymentService.createStripeIntent(request);

            PaymentIntentResponse response = new PaymentIntentResponse(
                    intent.getId(),
                    intent.getClientSecret(),
                    intent.getAmount(),
                    intent.getCurrency(),
                    intent.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ─── Card Payment: Save after Stripe confirms ───────────────────
    @PostMapping("/create")
    public ResponseEntity<Payment> createCardPayment(@RequestBody CreatePaymentRequest request) {
        try {
            Payment payment = new Payment();
            payment.setBookingId(request.getBookingId());
            payment.setCustomerId(request.getCustomerId());
            payment.setCustomerName(request.getCustomerName());
            payment.setPhoneNumber(request.getPhoneNumber());
            payment.setAmount(request.getAmount());
            payment.setDiscountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : 0);
            payment.calculateFinalAmount();
            payment.setPaymentMethod("CARD");
            payment.setPaymentStatus("PAYMENT SUCCESS");
            payment.setStripePaymentIntentId(request.getDescription()); // reuse description for intent ID
            payment.setPaymentDate(new Date());

            Payment savedPayment = paymentService.createPayment(payment);
            return ResponseEntity.ok(savedPayment);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // ─── Get all payments ───────────────────────────────────────────
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // ─── Get payment by ID ──────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ─── Update payment status ──────────────────────────────────────
    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable String id, @RequestParam String status) {
        Payment updated = paymentService.updatePaymentStatus(id, status);
        if (updated != null)
            return ResponseEntity.ok(updated);
        return ResponseEntity.notFound().build();
    }

    // ─── Delete payment ─────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable String id) {
        paymentService.deletePayment(id);
    }
}