package com.nsbm.group_04.FeedbackReview.services;

import com.nsbm.group_04.FeedbackReview.entity.FeedbackReview;
import com.nsbm.group_04.FeedbackReview.repository.FeedbackReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackReviewService {

    private final FeedbackReviewRepository repository;

    public FeedbackReviewService(FeedbackReviewRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public FeedbackReview addFeedback(FeedbackReview feedback) {
        feedback.setCreatedAt(LocalDateTime.now());
        return repository.save(feedback);
    }

    // READ - all feedbacks
    public List<FeedbackReview> getAllFeedbacks() {
        return repository.findAll();
    }

    // READ - single feedback by id
    public FeedbackReview getFeedbackById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
    }

    // UPDATE feedback
    public FeedbackReview updateFeedback(String id, FeedbackReview feedback) {
        FeedbackReview existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));

        existing.setFullName(feedback.getFullName());
        existing.setRating(feedback.getRating());
        existing.setComment(feedback.getComment());

        return repository.save(existing);
    }

    // DELETE feedback
    public void deleteFeedback(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Feedback not found with id: " + id);
        }
        repository.deleteById(id);
    }
}