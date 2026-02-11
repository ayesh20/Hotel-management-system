package com.nsbm.group_04.InventoryService.service;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.Repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Service class contains business logic for inventory operations
@Service
public class InventoryService
{
    // Automatically injects the InventoryRepository instance into this service.
    // Enables the service to perform CRUD operations on the inventory_items collection in MongoDB.
    @Autowired
    private InventoryRepository repository;

    // Create inventory item
    public InventoryItem addItem(InventoryItem item)
    {
        return repository.save(item);
    }

    // Get all items
    public List<InventoryItem> getAllItems()
    {
        return repository.findAll();
    }

    // Get item by id
    public Optional<InventoryItem> getItemById(String id)
    {
        return repository.findById(id);
    }

    // Update item
    public InventoryItem updateItem(InventoryItem item)
    {
        return repository.save(item);
    }

    // Delete item
    public void deleteItem(String id)
    {
        repository.deleteById(id);
    }
}
