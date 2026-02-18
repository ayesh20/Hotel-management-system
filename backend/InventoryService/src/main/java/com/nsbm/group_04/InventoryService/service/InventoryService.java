package com.nsbm.group_04.InventoryService.service;
import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.Repository.InventoryRepository;
import com.nsbm.group_04.InventoryService.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    // Repository used to interact with MongoDB
    private final InventoryRepository repository;

    // Constructor-based dependency injection
    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }


    // Adds a new inventory item and Validates reorder level and auto-calculates status.
    public InventoryItem addItem(InventoryItem item) {



        // Automatically determine stock status
        item.setStatus(calculateStatus(
                item.getQuantity(),
                item.getReorderLevel()
        ));

        return repository.save(item);
    }


    // Returns all inventory items.
    public List<InventoryItem> getAllItems() {
        return repository.findAll();
    }


    // Returns an inventory item by ID.
    public Optional<InventoryItem> getItemById(String id) {
        return repository.findById(id);
    }


    // Updates an existing inventory item and recalculates stock status.
    public InventoryItem updateItem(String id, InventoryItem itemDetails) {

        return repository.findById(id)
                .map(existingItem -> {


                    // Update fields
                    existingItem.setItemName(itemDetails.getItemName());
                    existingItem.setCategory(itemDetails.getCategory());
                    existingItem.setQuantity(itemDetails.getQuantity());
                    existingItem.setUnitPrice(itemDetails.getUnitPrice());
                    existingItem.setReorderLevel(itemDetails.getReorderLevel());
                    existingItem.setStorageLocation(itemDetails.getStorageLocation());
                    existingItem.setSupplier(itemDetails.getSupplier());

                    // Recalculate status
                    existingItem.setStatus(calculateStatus(
                            existingItem.getQuantity(),
                            existingItem.getReorderLevel()
                    ));

                    return repository.save(existingItem);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found with id: " + id));
    }


    //Deletes an item by ID.
    public void deleteItem(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Item does not exist with id: " + id);
        }
        repository.deleteById(id);
    }


    // Searches items by name (case-insensitive).
    public List<InventoryItem> searchItemsByName(String name) {
        return repository.findByItemNameIgnoreCase(name);
    }



    public List<InventoryItem> getLowStockItems() {
        return repository.findByStatusIn(List.of("LOW_STOCK", "OUT_OF_STOCK"));
    }


    // Returns items by category.
    public List<InventoryItem> getItemsByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category);
    }

    //Calculates total inventory value.
    public Double getTotalInventoryValue() {
        return repository.findAll().stream()
                .mapToDouble(item ->
                        item.getQuantity() * item.getUnitPrice())
                .sum();
    }

    //Determines stock status.
    private String calculateStatus(int quantity, int reorderLevel) {
        if (quantity == 0)
        {
            return "OUT_OF_STOCK";
        }
        else if (quantity <= reorderLevel)
        {
            return "LOW_STOCK";
        }
        else
        {
            return "IN_STOCK";
        }
    }
}
