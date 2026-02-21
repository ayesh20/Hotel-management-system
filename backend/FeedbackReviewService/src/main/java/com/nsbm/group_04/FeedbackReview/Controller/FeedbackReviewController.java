package com.nsbm.group_04.FeedbackReview.Controller;

import com.nsbm.group_04.FeedbackReview.entity.FeedbackReview;
import com.nsbm.group_04.FeedbackReview.services.FeedbackReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackReviewController {

    private final FeedbackReviewService feedbackService;

    public FeedbackReviewController(FeedbackReviewService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // CREATE - Add a new feedback
    @PostMapping
    public ResponseEntity<FeedbackReview> addFeedback(@Valid @RequestBody FeedbackReview feedback) {
        FeedbackReview savedFeedback = feedbackService.addFeedback(feedback);
        return ResponseEntity.ok(savedFeedback);
    }

    // READ - Get all feedbacks
    @GetMapping
    public ResponseEntity<List<FeedbackReview>> getAllFeedbacks() {
        List<FeedbackReview> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }

    // READ - Get a single feedback by id
    @GetMapping("/{id}")
    public ResponseEntity<FeedbackReview> getFeedbackById(@PathVariable String id) {
        try {
            FeedbackReview feedback = feedbackService.getFeedbackById(id);
            return ResponseEntity.ok(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE - Update an existing feedback
    @PutMapping("/{id}")
    public ResponseEntity<FeedbackReview> updateFeedback(
            @PathVariable String id,
            @Valid @RequestBody FeedbackReview feedback) {

        try {
            FeedbackReview updatedFeedback = feedbackService.updateFeedback(id, feedback);
            return ResponseEntity.ok(updatedFeedback);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Delete a feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable String id) {
        try {
            feedbackService.deleteFeedback(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}