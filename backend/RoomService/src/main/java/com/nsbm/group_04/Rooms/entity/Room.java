package com.nsbm.group_04.Rooms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;


@Document(collection = "room") // the MongoDB collection name
public class Room {

    @Id // MongoDB uses String ID
    private String id;

    @Field("room_number") // Maps to field name in MongoDB
    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @Field("room_specify")
    @NotBlank(message = "Room specify is required")
    private String roomSpecify;

    @Field("price")
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @Field("status")
    @NotBlank(message = "Status is required")
    private String status;

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;


    public Room() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "AVAILABLE";
    }

    public Room(String roomNumber, String roomSpecify, Double price, String status) {
        this.roomNumber = roomNumber;
        this.roomSpecify = roomSpecify;
        this.price = price;
        this.status = status;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
        this.updatedAt = LocalDateTime.now();
    }

    public String getRoomSpecify() {
        return roomSpecify;
    }

    public void setRoomSpecify(String roomSpecify) {
        this.roomSpecify = roomSpecify;
        this.updatedAt = LocalDateTime.now();
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
        this.updatedAt = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id='" + id + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", roomSpecify='" + roomSpecify + '\'' +
                ", price=" + price +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}