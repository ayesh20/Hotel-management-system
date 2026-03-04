package com.nsbm.group_04.InventoryService.dto;


import java.time.LocalDate;

public class InventoryItemResponseDTO
{
    private String id;
    private String itemName;
    private String category;
    private Integer quantity;
    private Double unitPrice;
    private Integer reorderLevel;
    private String storageLocation;
    private String supplier;
    private String status;
    private LocalDate lastUpdated;
    private LocalDate createdDate;

    // Derived field for convenience
    private Double totalValue;

    // Default constructor
    public InventoryItemResponseDTO() {}

    // Parameterized constructor
    public InventoryItemResponseDTO(String id, String itemName, String category,
                                    Integer quantity, Double unitPrice, Integer reorderLevel,
                                    String storageLocation, String supplier, String status,
                                    LocalDate lastUpdated, LocalDate createdDate) {
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
        this.createdDate = createdDate;
        this.totalValue = (quantity != null && unitPrice != null) ? quantity * unitPrice : null;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getStorageLocation() {
        return storageLocation;
    }

    public void setStorageLocation(String storageLocation) {
        this.storageLocation = storageLocation;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDate lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public Double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Double totalValue) {
        this.totalValue = totalValue;
    }

    @Override
    public String toString() {
        return "InventoryItemResponseDTO{" +
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
                ", createdDate=" + createdDate +
                ", totalValue=" + totalValue +
                '}';
    }

}
