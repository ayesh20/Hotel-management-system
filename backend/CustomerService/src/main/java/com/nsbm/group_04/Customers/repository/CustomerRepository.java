package com.nsbm.group_04.Customers.repository;

import com.nsbm.group_04.Customers.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
}
