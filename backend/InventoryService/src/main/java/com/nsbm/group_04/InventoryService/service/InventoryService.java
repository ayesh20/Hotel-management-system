package com.nsbm.group_04.InventoryService.service;

import com.nsbm.group_04.InventoryService.dto.EventReservationDTO;
import com.nsbm.group_04.InventoryService.Model.InventoryItem;

import java.util.List;

public interface InventoryService {

    InventoryItem addItem(InventoryItem item);
    List<InventoryItem> getAllItems();
    InventoryItem getItemById(String id);
    InventoryItem updateItem(String id, InventoryItem updatedItem);
    void deleteItem(String id);
    List<InventoryItem> searchItemsByName(String name);
    List<InventoryItem> getLowStockItems();
    List<InventoryItem> getItemsByCategory(String category);
    Double getTotalInventoryValue();
    InventoryItem restockItem(String id, int amount);
    InventoryItem consumeItem(String id, int amount);
    void reserveItemsForEvent(EventReservationDTO request);
}