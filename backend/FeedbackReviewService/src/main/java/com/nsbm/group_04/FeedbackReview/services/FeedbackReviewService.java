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

    // READ - all feedbacks for a hotel
    public List<FeedbackReview> getFeedbackByHotel(String hotelId) {
        return repository.findByHotelId(hotelId);
    }

    // READ - all feedbacks by a user
    public List<FeedbackReview> getFeedbackByUser(String userId) {
        return repository.findByUserId(userId);
    }

    // UPDATE feedback
    public FeedbackReview updateFeedback(String id, FeedbackReview feedback) {
        FeedbackReview existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));

        existing.setRating(feedback.getRating());
        existing.setComment(feedback.getComment());

        return repository.save(existing);
    }

    // DELETE feedback
    public void deleteFeedback(String id) {
        repository.deleteById(id);
    }
}
