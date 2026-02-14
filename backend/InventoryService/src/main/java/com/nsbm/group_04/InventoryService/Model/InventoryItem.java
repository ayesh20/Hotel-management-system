package com.nsbm.group_04.InventoryService.Model;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

// Marks this class as a MongoDB document and maps it to the "inventory_items" collection where all inventory item records are stored.
@Document(collection = "inventory_items")


public class InventoryItem {

    @Id // MongoDB document ID - automatically generated when a new inventory item is created

    //variable declaration
    private String id;
    @NotNull(message = "Item name cannot be null")
    private String itemName;
    private String category;
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;
    private Double unitPrice;
    private Integer reorderLevel;
    private String storageLocation;
    private String supplier;
    private String status;
    @LastModifiedDate
    private LocalDate lastUpdated;

    // No-argument constructor
    public  InventoryItem()
    {

    }

    // All-argument constructor
    public InventoryItem(String id, String itemName, String category, Integer quantity, Double unitPrice, Integer reorderLevel, String storageLocation, String supplier, String status, LocalDate lastUpdated) {
        this.id = id;
        this.itemName = itemName;
        this.category = category;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.reorderLevel = reorderLevel;
        this.storageLocation = storageLocation;
        this.supplier = supplier;
        this.status = status;
        this.lastUpdated = lastUpdated;
    }

    // Getters and Setters
    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getItemName()
    {
        return itemName;
    }

    public void setItemName(String itemName)
    {
        this.itemName = itemName;
    }

    public String getCategory()
    {
        return category;
    }

    public void setCategory(String category)
    {
        this.category = category;
    }

    public Integer getQuantity()
    {
        return quantity;
    }

    public void setQuantity(Integer quantity)
    {
        this.quantity = quantity;
    }

    public Double getUnitPrice()
    {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice)
    {
        this.unitPrice = unitPrice;
    }

    public Integer getReorderLevel()
    {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel)
    {
        this.reorderLevel = reorderLevel;
    }

    public String getStorageLocation()
    {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation)
    {
        this.storageLocation = storageLocation;
    }

    public String getSupplier()
    {
        return supplier;
    }

    public void setSupplier(String supplier)
    {
        this.supplier = supplier;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public LocalDate getLastUpdated()
    {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDate lastUpdated)
    {
        this.lastUpdated = lastUpdated;
    }

    // Returns a string representation of the InventoryItem object.
    // Useful for debugging, logging, and displaying object details in a readable format.
    @Override
    public String toString() {
        return "InventoryItem{" +
                "id='" + id + '\'' +
                ", itemName='" + itemName + '\'' +
                ", category='" + category + '\'' +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", reorderLevel=" + reorderLevel +
                ", storageLocation='" + storageLocation + '\'' +
                ", supplier='" + supplier + '\'' +
                ", status='" + status + '\'' +
                ", lastUpdated=" + lastUpdated +
                '}';
    }

}
