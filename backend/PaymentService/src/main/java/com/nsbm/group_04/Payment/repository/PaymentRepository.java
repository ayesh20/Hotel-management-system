package com.nsbm.group_04.Payment.repository;

import com.nsbm.group_04.Payment.entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByBookingId(String bookingId);
    List<Payment> findByCustomerId(String customerId);
    List<Payment> findByPaymentStatus(String paymentStatus);
}