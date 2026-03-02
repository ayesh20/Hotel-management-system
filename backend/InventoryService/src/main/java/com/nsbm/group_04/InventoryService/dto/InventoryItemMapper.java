package com.nsbm.group_04.InventoryService.dto;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;

public class InventoryItemMapper
{
    // Prevent instantiation
    private InventoryItemMapper() {}


    //Converts an InventoryItem entity to InventoryItemResponseDTO.

    public static InventoryItemResponseDTO toResponseDTO(InventoryItem item) {
        if (item == null) return null;

        return new InventoryItemResponseDTO(
                item.getId(),
                item.getItemName(),
                item.getCategory(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getReorderLevel(),
                item.getStorageLocation(),
                item.getSupplier(),
                item.getStatus(),
                item.getLastUpdated(),
                item.getCreatedDate()
        );
    }


    // Converts an InventoryItemRequestDTO to an InventoryItem entity.


    public static InventoryItem toEntity(InventoryItemRequestDTO dto) {
        if (dto == null) return null;

        InventoryItem item = new InventoryItem();
        item.setItemName(dto.getItemName());
        item.setCategory(dto.getCategory());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setReorderLevel(dto.getReorderLevel());
        item.setStorageLocation(dto.getStorageLocation());
        item.setSupplier(dto.getSupplier());
        return item;
    }


     // Updates an existing InventoryItem entity with values from a RequestDTO.
     // Preserves id, status, and timestamps (managed elsewhere).

    public static void updateEntityFromDTO(InventoryItemRequestDTO dto, InventoryItem item) {
        if (dto == null || item == null) return;

        item.setItemName(dto.getItemName());
        item.setCategory(dto.getCategory());
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(dto.getUnitPrice());
        item.setReorderLevel(dto.getReorderLevel());
        item.setStorageLocation(dto.getStorageLocation());
        item.setSupplier(dto.getSupplier());
    }

}
