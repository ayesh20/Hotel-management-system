package com.nsbm.group_04.InventoryService.Controller;

import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Handles HTTP requests related to inventory operations
@RestController
// Base URL for all inventory endpoints
@RequestMapping("/api/inventory")

public class InventoryController {
    // Injects InventoryService to delegate business logic and database operations
    @Autowired
    private InventoryService service;

    // Add a new inventory item
    //Handles POST requests for creating a new inventory item.
    @PostMapping
    public InventoryItem addItem(@RequestBody InventoryItem item) {
        return service.addItem(item);
    }

    // Get all items
    //Handles GET requests for retrieving items.
    @GetMapping
    public List<InventoryItem> getAllItems() {
        return service.getAllItems();
    }

    // Get a single item by ID
    //GET request with path variable to retrieve an item by ID.
    @GetMapping("/{id}")
    public Optional<InventoryItem> getItemById(@PathVariable String id) {
        return service.getItemById(id);
    }

    // Update an existing item
    //Handles PUT requests to update an existing item.
    @PutMapping
    public InventoryItem updateItem(@RequestBody InventoryItem item)
    //@RequestBody Maps JSON from the request body to a Java object.
    {
        return service.updateItem(item);
    }

    // Delete an item by ID
    //Handles DELETE requests to remove an item by ID.
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable String id)
    //@PathVariable Extracts variable from the URL path
    {
        service.deleteItem(id);
    }
}
