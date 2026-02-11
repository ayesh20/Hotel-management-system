package com.nsbm.group_04.InventoryService.Repository;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

// Repository interface for performing CRUD operations on InventoryItem collection
@Repository
public interface InventoryRepository extends MongoRepository<InventoryItem,String>
{

}
