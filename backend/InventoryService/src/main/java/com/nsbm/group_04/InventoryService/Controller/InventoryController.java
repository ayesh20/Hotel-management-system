package com.nsbm.group_04.InventoryService.Controller;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.dto.InventoryItemRequestDTO;
import com.nsbm.group_04.InventoryService.dto.InventoryItemResponseDTO;
import com.nsbm.group_04.InventoryService.dto.InventoryReservationRequest;
import com.nsbm.group_04.InventoryService.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



//Provides endpoints for CRUD operations and inventory reporting.
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService service;


    // Creates a new inventory item.
    @PostMapping
    public ResponseEntity<InventoryItemResponseDTO> addItem(@Valid @RequestBody InventoryItemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addItem(dto));
    }


    // Retrieves all inventory items.
    @GetMapping
    public ResponseEntity<List<InventoryItemResponseDTO>> getAllItems() {
        return ResponseEntity.ok(service.getAllItems());
    }


    // Retrieves a single inventory item by ID.
    // Returns 404 if item not found.

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItemResponseDTO> getItemById(@PathVariable String id) {
        return ResponseEntity.ok(service.getItemById(id));


    }


    // Updates an existing inventory item.
    // Status is automatically recalculated based on updated values.
    @PutMapping("/{id}")
    public ResponseEntity<InventoryItemResponseDTO> updateItem(
            @PathVariable String id,
            @Valid @RequestBody InventoryItemRequestDTO dto) {
        return ResponseEntity.ok(service.updateItem(id, dto));
    }


    // Deletes an inventory item by ID.
    // Returns 204 No Content on success.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        service.deleteItem(id);
        return ResponseEntity.noContent().build();
    }


    // Searches for items by name (case-insensitive).
    @GetMapping("/search")
    public ResponseEntity<List<InventoryItemResponseDTO>> searchItems(@RequestParam String name) {
        return ResponseEntity.ok(service.searchItemsByName(name));
    }


    // Retrieves items that need reordering (LOW_STOCK or OUT_OF_STOCK).
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItemResponseDTO>> getLowStockItems() {
        return ResponseEntity.ok(service.getLowStockItems());
    }


    // Retrieves items by category.
    @GetMapping("/category/{category}")
    public ResponseEntity<List<InventoryItemResponseDTO>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getItemsByCategory(category));
    }


    // Calculates total inventory value.
    // Returns the sum of (quantity × unit price) for all items.
    @GetMapping("/total-value")
    public ResponseEntity<Double> getTotalInventoryValue() {
        return ResponseEntity.ok(service.getTotalInventoryValue());
    }

    // Increases item quantity — restocking operation
    @PatchMapping("/{id}/restock")
    public ResponseEntity<InventoryItemResponseDTO> restockItem(
            @PathVariable String id,
            @RequestParam int amount) {
        return ResponseEntity.ok(service.restockItem(id, amount));
    }

    // Decreases item quantity — consumption operation
    @PatchMapping("/{id}/consume")
    public ResponseEntity<InventoryItemResponseDTO> consumeItem(
            @PathVariable String id,
            @RequestParam int amount) {
        return ResponseEntity.ok(service.consumeItem(id, amount));
    }

    @PostMapping("/reserve")
    public ResponseEntity<String> reserveInventory(
            @RequestBody InventoryReservationRequest request) {

        service.reserveItemsForEvent(request);
        return ResponseEntity.ok("Inventory reserved successfully");
    }
}
