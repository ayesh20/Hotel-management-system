package com.nsbm.group_04.InventoryService.service.impl;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.Repository.InventoryRepository;
import com.nsbm.group_04.InventoryService.dto.InventoryItemMapper;
import com.nsbm.group_04.InventoryService.dto.InventoryItemRequestDTO;
import com.nsbm.group_04.InventoryService.dto.InventoryItemResponseDTO;
import com.nsbm.group_04.InventoryService.dto.InventoryReservationRequest;
import com.nsbm.group_04.InventoryService.exception.ResourceNotFoundException;
import com.nsbm.group_04.InventoryService.service.InventoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService
{
    private final InventoryRepository repository;

    public InventoryServiceImpl(InventoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public InventoryItemResponseDTO addItem(InventoryItemRequestDTO dto) {
        InventoryItem item = InventoryItemMapper.toEntity(dto);
        item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));
        return InventoryItemMapper.toResponseDTO(repository.save(item));
    }

    @Override
    public List<InventoryItemResponseDTO> getAllItems() {
        return repository.findAll()
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryItemResponseDTO getItemById(String id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return InventoryItemMapper.toResponseDTO(item);
    }

    @Override
    public InventoryItemResponseDTO updateItem(String id, InventoryItemRequestDTO dto) {
        InventoryItem existingItem = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        InventoryItemMapper.updateEntityFromDTO(dto, existingItem);
        existingItem.setStatus(calculateStatus(existingItem.getQuantity(), existingItem.getReorderLevel()));

        return InventoryItemMapper.toResponseDTO(repository.save(existingItem));
    }

    @Override
    public void deleteItem(String id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item does not exist with id: " + id));

        if (item.getQuantity() > 0) {
            throw new IllegalArgumentException(
                    "Cannot delete item with existing stock. Current quantity: " + item.getQuantity()
            );
        }

        repository.deleteById(id);
    }

    @Override
    public List<InventoryItemResponseDTO> searchItemsByName(String name) {
        return repository.findByItemNameIgnoreCase(name)
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryItemResponseDTO> getLowStockItems() {
        return repository.findByStatusIn(List.of("LOW_STOCK", "OUT_OF_STOCK"))
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryItemResponseDTO> getItemsByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category)
                .stream()
                .map(InventoryItemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Double getTotalInventoryValue() {
        return repository.findAll()
                .stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();
    }

    @Override
    public InventoryItemResponseDTO restockItem(String id, int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Restock amount must be positive. Provided: " + amount);
        }
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        item.setQuantity(item.getQuantity() + amount);
        item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));

        return InventoryItemMapper.toResponseDTO(repository.save(item));
    }

    @Override
    public InventoryItemResponseDTO consumeItem(String id, int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Consume amount must be positive. Provided: " + amount);
        }
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (item.getQuantity() < amount) {
            throw new IllegalArgumentException(
                    "Insufficient stock for '" + item.getItemName() + "'. Available: " + item.getQuantity() + ", Requested: " + amount
            );
        }

        item.setQuantity(item.getQuantity() - amount);
        item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));

        return InventoryItemMapper.toResponseDTO(repository.save(item));
    }

    // Private helper
    private String calculateStatus(int quantity, int reorderLevel) {
        if (quantity == 0) return "OUT_OF_STOCK";
        if (quantity <= reorderLevel) return "LOW_STOCK";
        return "IN_STOCK";
    }

    public void reserveItemsForEvent(InventoryReservationRequest request) {
        int requiredChairs = request.getAttendees();

        InventoryItem chairs = repository.findByItemNameIgnoreCase("Chair")
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Chair item not found"));

        if (chairs.getQuantity() < requiredChairs) {
            throw new IllegalArgumentException("Not enough chairs available");
        }

        chairs.setQuantity(chairs.getQuantity() - requiredChairs);
        chairs.setStatus(calculateStatus(chairs.getQuantity(), chairs.getReorderLevel()));

        repository.save(chairs);
    }
}
