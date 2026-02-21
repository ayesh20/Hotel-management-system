package com.nsbm.group_04.FeedbackReview.repository;

import com.nsbm.group_04.FeedbackReview.entity.FeedbackReview;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeedbackReviewRepository extends MongoRepository<FeedbackReview, String> {
}
