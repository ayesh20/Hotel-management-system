package com.nsbm.group_04.InventoryService.service.impl;

import com.nsbm.group_04.InventoryService.dto.EventReservationDTO;
import com.nsbm.group_04.InventoryService.Model.InventoryItem;
import com.nsbm.group_04.InventoryService.Repository.InventoryRepository;
import com.nsbm.group_04.InventoryService.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;


    private static final String EVENT_SERVICE_URL = "http://localhost:8083/api/events/";




    @Override
    public InventoryItem addItem(InventoryItem item) {
        item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));
        item.setCreatedDate(LocalDate.now());
        item.setLastUpdated(LocalDate.now());
        return inventoryRepository.save(item);
    }

    @Override
    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    @Override
    public InventoryItem getItemById(String id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));
    }

    @Override
    public InventoryItem updateItem(String id, InventoryItem updatedItem) {
        InventoryItem existing = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));

        existing.setItemName(updatedItem.getItemName());
        existing.setCategory(updatedItem.getCategory());
        existing.setQuantity(updatedItem.getQuantity());
        existing.setUnitPrice(updatedItem.getUnitPrice());
        existing.setReorderLevel(updatedItem.getReorderLevel());
        existing.setStorageLocation(updatedItem.getStorageLocation());
        existing.setSupplier(updatedItem.getSupplier());
        existing.setStatus(calculateStatus(updatedItem.getQuantity(), updatedItem.getReorderLevel()));
        existing.setLastUpdated(LocalDate.now());
        existing.setEventId(updatedItem.getEventId());
        existing.setHallName(updatedItem.getHallName());
        existing.setPeopleCount(updatedItem.getPeopleCount());
        existing.setBookingDate(updatedItem.getBookingDate());
        existing.setBookingTime(updatedItem.getBookingTime());

        return inventoryRepository.save(existing);
    }

    @Override
    public void deleteItem(String id) {
        if (!inventoryRepository.existsById(id)) {
            throw new RuntimeException("Inventory item not found with id: " + id);
        }
        inventoryRepository.deleteById(id);
    }




    @Override
    public List<InventoryItem> searchItemsByName(String name) {
        return inventoryRepository.findByItemNameContainingIgnoreCase(name);
    }

    @Override
    public List<InventoryItem> getLowStockItems() {
        return inventoryRepository.findAll()
                .stream()
                .filter(item -> "LOW_STOCK".equals(item.getStatus()) || "OUT_OF_STOCK".equals(item.getStatus()))
                .toList();
    }

    @Override
    public List<InventoryItem> getItemsByCategory(String category) {
        return inventoryRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    public Double getTotalInventoryValue() {
        return inventoryRepository.findAll()
                .stream()
                .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
                .sum();
    }



    @Override
    public InventoryItem restockItem(String id, int amount) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));

        item.setQuantity(item.getQuantity() + amount);
        item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));
        item.setLastUpdated(LocalDate.now());

        return inventoryRepository.save(item);
    }

    @Override
    public InventoryItem consumeItem(String id, int amount) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found with id: " + id));

        if (item.getQuantity() < amount) {
            throw new RuntimeException("Insufficient stock for item: " + item.getItemName());
        }

        item.setQuantity(item.getQuantity() - amount);
        item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));
        item.setLastUpdated(LocalDate.now());

        return inventoryRepository.save(item);
    }




    @Override
    public void reserveItemsForEvent(EventReservationDTO request) {
        RestTemplate restTemplate = new RestTemplate();


        EventReservationDTO eventData = null;
        try {
            String url = EVENT_SERVICE_URL + request.getEventId();
            eventData = restTemplate.getForObject(url, EventReservationDTO.class);
            System.out.println("[InventoryServiceImpl] Fetched event: " + eventData);
        } catch (Exception e) {
            System.out.println("[InventoryServiceImpl] Could not reach Event service: " + e.getMessage());
            // Fall back to using the request data directly if Event service is down
            eventData = request;
        }

        String hallName   = (eventData != null && eventData.getHallName()  != null) ? eventData.getHallName()  : request.getHallName();
        Integer attendees = (eventData != null && eventData.getPeopleCount() != null) ? eventData.getPeopleCount() : request.getPeopleCount();

        if (hallName == null || attendees == null || attendees <= 0) {
            throw new RuntimeException("Invalid event data: hallName or attendees missing.");
        }



        List<InventoryItem> requiredItems = inventoryRepository.findByCategoryIgnoreCase("EVENT_SUPPLY");

        if (requiredItems.isEmpty()) {
            System.out.println("[InventoryServiceImpl] No event-supply items found in inventory.");
            return;
        }


        for (InventoryItem item : requiredItems) {
            int needed = calculateRequiredQty(item, attendees);

            if (item.getQuantity() < needed) {
                throw new RuntimeException(
                        "Insufficient stock for item '" + item.getItemName() +
                                "'. Required: " + needed + ", Available: " + item.getQuantity()
                );
            }

            item.setQuantity(item.getQuantity() - needed);
            item.setStatus(calculateStatus(item.getQuantity(), item.getReorderLevel()));
            item.setLastUpdated(LocalDate.now());


            item.setStorageLocation("RESERVED – Hall: " + hallName + " | Event: " + request.getEventId());

            inventoryRepository.save(item);

            System.out.println("[InventoryServiceImpl] Reserved " + needed + " x '" +
                    item.getItemName() + "' for event " + request.getEventId());
        }
    }





    private int calculateRequiredQty(InventoryItem item, int attendees) {
        // Default: 1 unit per attendee — override per item/category if needed
        return attendees;
    }


    private String calculateStatus(int quantity, int reorderLevel) {
        if (quantity == 0) {
            return "OUT_OF_STOCK";
        } else if (quantity <= reorderLevel) {
            return "LOW_STOCK";
        } else {
            return "IN_STOCK";
        }
    }
}