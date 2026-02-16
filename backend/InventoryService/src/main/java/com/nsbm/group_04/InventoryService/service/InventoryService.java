package com.nsbm.group_04.InventoryService.service;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.Repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    // Using 'final' ensures this repository cannot be changed after the service starts
    private final InventoryRepository repository;

    // Constructor Injection: This is preferred over @Autowired on the field.
    // Spring automatically finds the InventoryRepository and passes it here.
    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    // Create inventory item
    public InventoryItem addItem(InventoryItem item) {
        return repository.save(item);
    }

    // Get all items
    public List<InventoryItem> getAllItems() {
        return repository.findAll();
    }

    // Get item by id
    public Optional<InventoryItem> getItemById(String id) {
        return repository.findById(id);
    }

    /**
     * Update item logic:
     * Instead of just calling .save(),  checking if the item exists.
     * This prevents creating a brand new record if a wrong ID is passed.
     */
    public InventoryItem updateItem(String id, InventoryItem itemDetails) {
        return repository.findById(id)
                .map(existingItem -> {
                    // Use the correct method names from your Model
                    existingItem.setItemName(itemDetails.getItemName());
                    existingItem.setQuantity(itemDetails.getQuantity());
                    existingItem.setCategory(itemDetails.getCategory());
                    existingItem.setUnitPrice(itemDetails.getUnitPrice());
                    existingItem.setReorderLevel(itemDetails.getReorderLevel());
                    existingItem.setStorageLocation(itemDetails.getStorageLocation());
                    existingItem.setSupplier(itemDetails.getSupplier());
                    existingItem.setStatus(itemDetails.getStatus());

                    return repository.save(existingItem);
                })
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    // Delete item
    public void deleteItem(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Cannot delete: Item with id " + id + " does not exist.");
        }
    }
}