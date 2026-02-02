package com.nsbm.group_04.Rooms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Main Spring Boot Application Class
 * Entry point for the Rooms Management System
 */
@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.nsbm.group_04.Rooms.repository")
public class RoomsApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoomsApplication.class, args);
		System.out.println("\n==============================================");
		System.out.println("✓ Rooms Management System Started Successfully");
		System.out.println("✓ Server running on: http://localhost:8080");
		System.out.println("==============================================\n");
	}

}