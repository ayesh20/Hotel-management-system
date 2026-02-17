package com.nsbm.group_04.InventoryService.service;
import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.Repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer that contains business logic
 * for managing hotel inventory operations.
 */
@Service
public class InventoryService {

    // Repository used to interact with MongoDB
    private final InventoryRepository repository;

    // Constructor-based dependency injection
    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    /**
     * Adds a new inventory item.
     * Validates reorder level and auto-calculates status.
     */
    public InventoryItem addItem(InventoryItem item) {

        // Business rule validation
        if (item.getReorderLevel() > item.getQuantity()) {
            throw new IllegalArgumentException(
                    "Reorder level cannot be greater than quantity"
            );
        }

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

    /**
     * Updates an existing inventory item
     * and recalculates stock status.
     */
    public InventoryItem updateItem(String id, InventoryItem itemDetails) {

        return repository.findById(id)
                .map(existingItem -> {

                    // Validate reorder level
                    if (itemDetails.getReorderLevel() > itemDetails.getQuantity()) {
                        throw new IllegalArgumentException(
                                "Reorder level cannot be greater than quantity"
                        );
                    }

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
                        new RuntimeException("Item not found"));
    }


    //Deletes an item by ID.
    public void deleteItem(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Item does not exist");
        }
        repository.deleteById(id);
    }

    /**
     * Searches items by name (case-insensitive).
     */
    public List<InventoryItem> searchItemsByName(String name) {
        return repository.findByItemNameIgnoreCase(name);
    }

    //Returns items that need reordering.

    public List<InventoryItem> getLowStockItems() {
        return repository.findAll().stream()
                .filter(item -> item.getQuantity() <= item.getReorderLevel())
                .toList();
    }


     // Returns items by category.
    public List<InventoryItem> getItemsByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category);
    }

    //Calculates total inventory value.
    //(quantity × unit price)
    public Double getTotalInventoryValue() {
        return repository.findAll().stream()
                .mapToDouble(item ->
                        item.getQuantity() * item.getUnitPrice())
                .sum();
    }

    //Determines stock status.
    private String calculateStatus(int quantity, int reorderLevel) {
        if (quantity == 0) return "OUT_OF_STOCK";
        else if (quantity <= reorderLevel) return "LOW_STOCK";
        else return "IN_STOCK";
    }
}
