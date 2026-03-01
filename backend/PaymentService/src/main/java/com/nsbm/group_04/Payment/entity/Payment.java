package com.nsbm.group_04.Payment.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "payments")
public class Payment {

    @Id
    private String paymentId;

    private String bookingId;
    private String customerId;

    private double amount;
    private double discountAmount;
    private double finalAmount;

    private String paymentMethod;   // CARD, CASH
    private String paymentStatus;   // PAID, PENDING
    private String currency;

    private String stripePaymentIntentId;   // ADDED (Stripe reference)

    private Date paymentDate;

    // Default constructor
    public Payment() {
    }

    // Updated Constructor
    public Payment(String paymentId, String bookingId, String customerId,
                   double amount, double discountAmount,
                   String paymentMethod, String paymentStatus,
                   String currency, String stripePaymentIntentId,
                   Date paymentDate) {

        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.amount = amount;
        this.discountAmount = discountAmount;
        this.finalAmount = amount - discountAmount; // ✅ Auto calculate
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.currency = currency;
        this.stripePaymentIntentId = stripePaymentIntentId;
        this.paymentDate = paymentDate;
    }

    // Optional: Auto calculate method
    public void calculateFinalAmount() {
        this.finalAmount = this.amount - this.discountAmount;
    }

    // Getters and Setters

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }

    public double getFinalAmount() { return finalAmount; }
    public void setFinalAmount(double finalAmount) { this.finalAmount = finalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getStripePaymentIntentId() { return stripePaymentIntentId; }
    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    public Date getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Date paymentDate) { this.paymentDate = paymentDate; }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentId='" + paymentId + '\'' +
                ", bookingId='" + bookingId + '\'' +
                ", customerId='" + customerId + '\'' +
                ", amount=" + amount +
                ", discountAmount=" + discountAmount +
                ", finalAmount=" + finalAmount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", currency='" + currency + '\'' +
                ", stripePaymentIntentId='" + stripePaymentIntentId + '\'' +
                ", paymentDate=" + paymentDate +
                '}';
    }
}