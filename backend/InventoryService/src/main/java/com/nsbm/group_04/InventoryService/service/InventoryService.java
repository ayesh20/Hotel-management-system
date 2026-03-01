package com.nsbm.group_04.InventoryService.service;
import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.Repository.InventoryRepository;
import com.nsbm.group_04.InventoryService.dto.InventoryItemMapper;
import com.nsbm.group_04.InventoryService.dto.InventoryItemRequestDTO;
import com.nsbm.group_04.InventoryService.dto.InventoryItemResponseDTO;
import com.nsbm.group_04.InventoryService.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    // Repository used to interact with MongoDB
    private final InventoryRepository repository;

    // Constructor-based dependency injection
    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }


    // Adds a new inventory item and auto-calculates status.
    public InventoryItemResponseDTO addItem(InventoryItemRequestDTO dto) {
        InventoryItem item = InventoryItemMapper.toEntity(dto);
        item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));
        return InventoryItemMapper.toResponseDTO(repository.save(item));
    }


    // Returns all inventory items.
    public List<InventoryItemResponseDTO> getAllItems() {
        return repository.findAll()
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }


    // Returns an inventory item by ID.
    public InventoryItemResponseDTO getItemById(String id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return InventoryItemMapper.toResponseDTO(item);
    }


    // Updates an existing inventory item and recalculates stock status.
    public InventoryItemResponseDTO updateItem(String id, InventoryItemRequestDTO dto) {
        InventoryItem existingItem = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        InventoryItemMapper.updateEntityFromDTO(dto, existingItem);
        existingItem.setStatus(calculateStatus(existingItem.getQuantity(), existingItem.getReorderLevel()));

        return InventoryItemMapper.toResponseDTO(repository.save(existingItem));
    }


    // Deletes an item by ID. Prevents deletion if stock exists.
    public void deleteItem(String id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item does not exist with id: " + id));

        if (item.getQuantity() > 0) {
            throw new IllegalArgumentException(
                    "Cannot delete item with existing stock. " +
                            "Current quantity: " + item.getQuantity() +
                            ". Please reduce quantity to 0 before deleting."
            );
        }

        repository.deleteById(id);
    }



    // Searches items by name (case-insensitive).
    public List<InventoryItemResponseDTO> searchItemsByName(String name) {
        return repository.findByItemNameIgnoreCase(name)
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Returns items that need reordering (LOW_STOCK or OUT_OF_STOCK status).
    public List<InventoryItemResponseDTO> getLowStockItems() {
        return repository.findByStatusIn(List.of("LOW_STOCK", "OUT_OF_STOCK"))
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }


    // Returns items by category.
    public List<InventoryItemResponseDTO> getItemsByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category)
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Calculates total inventory value (sum of quantity × unitPrice for all items).
    public Double getTotalInventoryValue() {
        return repository.findAll()
                .stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
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

    // Increases item quantity — restocking operation.
    public InventoryItemResponseDTO restockItem(String id, int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Restock amount must be positive. Provided: " + amount);
        }
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        int newQuantity = item.getQuantity() + amount;
        item.setQuantity(newQuantity);
        item.setStatus(calculateStatus(newQuantity, item.getReorderLevel()));

        return InventoryItemMapper.toResponseDTO(repository.save(item));
    }

    // Decreases item quantity — consumption operation.
    public InventoryItemResponseDTO consumeItem(String id, int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Consume amount must be positive. Provided: " + amount);
        }
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (item.getQuantity() < amount) {
            throw new IllegalArgumentException(
                    "Insufficient stock for '" + item.getItemName() + "'. " +
                            "Available: " + item.getQuantity() +
                            ", Requested: " + amount
            );
        }

        int newQuantity = item.getQuantity() - amount;
        item.setQuantity(newQuantity);
        item.setStatus(calculateStatus(newQuantity, item.getReorderLevel()));

        return InventoryItemMapper.toResponseDTO(repository.save(item));
    }
}
