package com.nsbm.group_04.InventoryService.Repository;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository interface for performing CRUD operations on InventoryItem collection
@Repository
public interface InventoryRepository extends MongoRepository<InventoryItem, String>
{
    // Finds items by name (Spring automatically generates the query)
    List<InventoryItem> findByItemName(String itemName);


    // Finds items where quantity is greater than a specific number
    List<InventoryItem> findByQuantityGreaterThan(int quantity);

}
