package com.nsbm.group_04.Customers.service;

import com.nsbm.group_04.Customers.model.Customer;

import java.util.List;

public interface CustomerService {
    Customer saveCustomer(Customer customer);
    List<Customer> getAllCustomers();
    Customer getCustomerById(String id);
    void deleteCustomer(String id);
}
