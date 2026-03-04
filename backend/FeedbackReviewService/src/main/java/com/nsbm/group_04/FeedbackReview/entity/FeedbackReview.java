package com.nsbm.group_04.FeedbackReview.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Document(collection = "feedbacks")
public class FeedbackReview {

    @Id
    private String id;

    private String fullName;

    // ✅ Rating as String
    @NotBlank
    private String rating;

    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    // ======================
    // Constructors
    // ======================

    public FeedbackReview() {
    }

    public FeedbackReview(String id, String fullName, String rating, String comment) {
        this.id = id;
        this.fullName = fullName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    // ======================
    // Getters
    // ======================

    public String getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getRating() {   // ✅ FIXED
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ======================
    // Setters
    // ======================

    public void setId(String id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setRating(String rating) {  // ✅ FIXED
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // ======================
    // toString
    // ======================

    @Override
    public String toString() {
        return "FeedbackReview{" +
                "id='" + id + '\'' +
                ", fullName='" + fullName + '\'' +
                ", rating='" + rating + '\'' +
                ", comment='" + comment + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}