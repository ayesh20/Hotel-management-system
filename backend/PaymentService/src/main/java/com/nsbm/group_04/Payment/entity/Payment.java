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
    private String roomId;

    private double amount;
    private double discountAmount;
    private double finalAmount;

    private String paymentMethod; // CARD, CASH, ONLINE
    private String paymentStatus; // PAID, PENDING, FAILED

    private String transactionId;
    private String currency;

    private Date paymentDate;

    // Default constructor
    public Payment() {}

    public Payment(String paymentId, String bookingId, String customerId, String roomId, double amount, double discountAmount, double finalAmount, String paymentMethod, String paymentStatus, String transactionId, String currency, Date paymentDate) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.roomId = roomId;
        this.amount = amount;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.currency = currency;
        this.paymentDate = paymentDate;
    }

    // Getters and Setters
    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentId='" + paymentId + '\'' +
                ", bookingId='" + bookingId + '\'' +
                ", customerId='" + customerId + '\'' +
                ", roomId='" + roomId + '\'' +
                ", amount=" + amount +
                ", discountAmount=" + discountAmount +
                ", finalAmount=" + finalAmount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", transactionId='" + transactionId + '\'' +
                ", currency='" + currency + '\'' +
                ", paymentDate=" + paymentDate +
                '}';
    }

}
