package com.nsbm.group_04.InventoryService.Repository;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository interface for performing CRUD operations on InventoryItem collection
@Repository
public interface InventoryRepository extends MongoRepository<InventoryItem, String> {

    // Finds items by name (case-insensitive)
    // Spring automatically generates the query
    List<InventoryItem> findByItemNameIgnoreCase(String itemName);

    // Finds items where quantity is greater than a specific number
    List<InventoryItem> findByQuantityGreaterThan(int quantity);

    // Finds items by category (case-insensitive)
    List<InventoryItem> findByCategoryIgnoreCase(String category);

    // Finds items by status
    List<InventoryItem> findByStatus(String status);
}