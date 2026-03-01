package com.nsbm.group_04.Payment.service;

import com.nsbm.group_04.Payment.entity.Payment;
import com.nsbm.group_04.Payment.repository.PaymentRepository;
import com.nsbm.group_04.Payment.dto.CreatePaymentRequest;
import com.nsbm.group_04.Payment.dto.CreateIntentRequest;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // -------------------------
    // MongoDB Payment Methods
    // -------------------------

    // Create new payment in DB
    public Payment createPayment(Payment payment) {
        if (payment.getPaymentId() == null) {
            payment.setPaymentId(UUID.randomUUID().toString());
        }

        payment.setPaymentDate(new Date());

        // Calculate final amount if not already set
        if (payment.getFinalAmount() == 0) {
            payment.setFinalAmount(payment.getAmount() - payment.getDiscountAmount());
        }

        return paymentRepository.save(payment);
    }

    // Update payment status
    public Payment updatePaymentStatus(String paymentId, String status) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setPaymentStatus(status);
            payment.setPaymentDate(new Date());
            return paymentRepository.save(payment);
        }
        return null;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public List<Payment> getPaymentsByCustomer(String customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }

    public void deletePayment(String paymentId) {
        paymentRepository.deleteById(paymentId);
    }

    // -------------------------
    // Stripe Payment Methods
    // -------------------------

    // Create a PaymentIntent (returns clientSecret to frontend)
    public PaymentIntent createStripeIntent(CreateIntentRequest request) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount())
                .setCurrency(request.getCurrency() != null ? request.getCurrency() : "usd")
                .setDescription(request.getDescription() != null ? request.getDescription() : "Hotel Booking Payment")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();

        return PaymentIntent.create(params);
    }

    // Legacy method (kept for backward compatibility)
    public PaymentIntent createStripePayment(CreatePaymentRequest request) throws Exception {

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount())
                .setCurrency(request.getCurrency())
                .setDescription(request.getDescription())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();

        return PaymentIntent.create(params);
    }
}