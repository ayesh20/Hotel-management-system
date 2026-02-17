package com.nsbm.group_04.InventoryService.Controller;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
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
    public ResponseEntity<InventoryItem> addItem(@Valid @RequestBody InventoryItem item) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addItem(item));
    }


     // Retrieves all inventory items.
    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllItems() {
        return ResponseEntity.ok(service.getAllItems());
    }


     // Retrieves a single inventory item by ID.
     // Returns 404 if item not found.

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItemById(@PathVariable String id) {
        return service.getItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


     // Updates an existing inventory item.
     // Status is automatically recalculated based on updated values.
    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateItem(
            @PathVariable String id,
            @Valid @RequestBody InventoryItem item) {
        return ResponseEntity.ok(service.updateItem(id, item));
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
    public ResponseEntity<List<InventoryItem>> searchItems(@RequestParam String name) {
        return ResponseEntity.ok(service.searchItemsByName(name));
    }


     // Retrieves items that need reordering (LOW_STOCK or OUT_OF_STOCK).
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItem>> getLowStockItems() {
        return ResponseEntity.ok(service.getLowStockItems());
    }


     // Retrieves items by category.
    @GetMapping("/category/{category}")
    public ResponseEntity<List<InventoryItem>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(service.getItemsByCategory(category));
    }


     // Calculates total inventory value.
     // Returns the sum of (quantity × unit price) for all items.
    @GetMapping("/total-value")
    public ResponseEntity<Double> getTotalInventoryValue() {
        return ResponseEntity.ok(service.getTotalInventoryValue());
    }
}