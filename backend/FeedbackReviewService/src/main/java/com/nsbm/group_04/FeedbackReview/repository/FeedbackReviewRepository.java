package com.nsbm.group_04.FeedbackReview.repository;

import com.nsbm.group_04.FeedbackReview.entity.FeedbackReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedbackReviewRepository extends MongoRepository<FeedbackReview, String> {

    List<FeedbackReview> findByHotelId(String hotelId);

    List<FeedbackReview> findByUserId(String userId);
}
