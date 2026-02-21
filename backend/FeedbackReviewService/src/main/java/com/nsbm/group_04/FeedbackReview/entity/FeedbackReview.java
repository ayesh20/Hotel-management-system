package com.nsbm.group_04.FeedbackReview.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;

@Document(collection = "feedbacks")
public class FeedbackReview {

    @Id
    private String id;

    private String fullName;

    @Min(1)
    @Max(5)
    private int rating;          // 1 to 5

    private String comment;
    private LocalDateTime createdAt;

    // No-args constructor
    public FeedbackReview() {
    }

    // All-args constructor
    public FeedbackReview(String id, String fullName, int rating, String comment) {
        this.id = id;
        this.fullName = fullName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @Override
    public String toString() {
        return "FeedbackReview{" +
                "id='" + id + '\'' +
                ", fullName='" + fullName + '\'' +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
