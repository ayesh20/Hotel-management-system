package com.nsbm.group_04.InventoryService.service;
import com.nsbm.group_04.InventoryService.dto.InventoryItemRequestDTO;
import com.nsbm.group_04.InventoryService.dto.InventoryItemResponseDTO;
import java.util.List;


public interface InventoryService {

    InventoryItemResponseDTO addItem(InventoryItemRequestDTO dto);
    List<InventoryItemResponseDTO> getAllItems();
    InventoryItemResponseDTO getItemById(String id);
    InventoryItemResponseDTO updateItem(String id, InventoryItemRequestDTO dto);
    void deleteItem(String id);
    List<InventoryItemResponseDTO> searchItemsByName(String name);
    List<InventoryItemResponseDTO> getLowStockItems();
    List<InventoryItemResponseDTO> getItemsByCategory(String category);
    Double getTotalInventoryValue();
    InventoryItemResponseDTO restockItem(String id, int amount);
    InventoryItemResponseDTO consumeItem(String id, int amount);
}

