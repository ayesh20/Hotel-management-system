package com.nsbm.group_04.Customers.service.impl;

import com.nsbm.group_04.Customers.model.Customer;
import com.nsbm.group_04.Customers.repository.CustomerRepository;
import com.nsbm.group_04.Customers.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository;

    public CustomerServiceImpl(CustomerRepository repository) {
        this.repository = repository;
    }

    @Override
    public Customer saveCustomer(Customer customer) {
        return repository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    @Override
    public Customer getCustomerById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void deleteCustomer(String id) {
        repository.deleteById(id);
    }

}
