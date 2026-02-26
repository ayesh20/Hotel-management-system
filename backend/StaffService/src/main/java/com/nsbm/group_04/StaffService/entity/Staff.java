package com.nsbm.group_04.StaffService.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "staff")
public class Staff {
    @Id
    private String id;

    private String name;
    private String role;
    private String phone;
    private String email;
    private String password;
    private double salary;

    //Constructors
    public Staff(){}

    public Staff(String name, String role, String phone, String email,String password, double salary) {
        this.name = name;
        this.role = role;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.salary = salary;
    }

    // Getters

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public double getSalary() {
        return salary;
    }

    // Setters

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }
}
