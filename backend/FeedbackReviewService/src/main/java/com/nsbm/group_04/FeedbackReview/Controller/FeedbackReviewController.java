package com.nsbm.group_04.FeedbackReview.Controller;

import com.nsbm.group_04.FeedbackReview.entity.FeedbackReview;
import com.nsbm.group_04.FeedbackReview.services.FeedbackReviewService;
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
    public ResponseEntity<FeedbackReview> addFeedback(@RequestBody FeedbackReview feedback) {
        FeedbackReview savedFeedback = feedbackService.addFeedback(feedback);
        return ResponseEntity.ok(savedFeedback);
    }

    // READ - Get all feedbacks for a hotel
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<FeedbackReview>> getFeedbackByHotel(@PathVariable String hotelId) {
        List<FeedbackReview> feedbacks = feedbackService.getFeedbackByHotel(hotelId);
        return ResponseEntity.ok(feedbacks);
    }

    // READ - Get all feedbacks by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedbackReview>> getFeedbackByUser(@PathVariable String userId) {
        List<FeedbackReview> feedbacks = feedbackService.getFeedbackByUser(userId);
        return ResponseEntity.ok(feedbacks);
    }

    // UPDATE - Update an existing feedback
    @PutMapping("/{id}")
    public ResponseEntity<FeedbackReview> updateFeedback(
            @PathVariable String id,
            @RequestBody FeedbackReview feedback) {

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

