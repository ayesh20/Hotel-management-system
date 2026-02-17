package com.nsbm.group_04.Payment.services;

import com.nsbm.group_04.Payment.entity.Payment;
import com.nsbm.group_04.Payment.repository.PaymentRepository;
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

    // Create new payment (auto generates paymentId and transactionId)
    public Payment createPayment(Payment payment) {
        if (payment.getPaymentId() == null) {
            payment.setPaymentId(UUID.randomUUID().toString());
        }
        if (payment.getTransactionId() == null) {
            payment.setTransactionId(UUID.randomUUID().toString());
        }

        payment.setPaymentStatus("PENDING");
        payment.setCreatedAt(new Date());
        payment.setUpdatedAt(new Date());

        // Calculate final amount
        double finalAmount = payment.getAmount() - payment.getDiscountAmount();
        payment.setFinalAmount(finalAmount);

        return paymentRepository.save(payment);
    }

    // Update payment status
    public Payment updatePaymentStatus(String paymentId, String status) {
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setPaymentStatus(status);
            payment.setUpdatedAt(new Date());
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
}
