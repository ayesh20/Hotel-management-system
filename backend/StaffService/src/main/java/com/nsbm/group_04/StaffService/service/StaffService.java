package com.nsbm.group_04.StaffService.service;

import com.nsbm.group_04.StaffService.entity.Staff;
import com.nsbm.group_04.StaffService.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE STAFF with auto-generated ID (stf001, stf002...)
    public Staff createStaff(Staff staff) {

        // Check if email already exists
        Optional<Staff> existing = staffRepository.findByEmail(staff.getEmail());

        if (existing.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Generate ID
        if (staff.getId() == null || staff.getId().isEmpty()) {

            Optional<Staff> lastStaff = staffRepository.findTopByOrderByIdDesc();

            String newId;

            if (lastStaff.isPresent()) {

                String lastId = lastStaff.get().getId();

                int number = Integer.parseInt(lastId.replace("stf", ""));

                newId = String.format("stf%03d", number + 1);

            } else {
                newId = "stf001";
            }

            staff.setId(newId);
        }

        // Encrypt password only if provided
        if (staff.getPassword() != null && !staff.getPassword().isEmpty()) {

            staff.setPassword(passwordEncoder.encode(staff.getPassword()));

        } else {

            // Password required for admin
            if ("admin".equalsIgnoreCase(staff.getRole())) {
                throw new RuntimeException("Password is required for admin");
            }

            // Staff can have no password
            staff.setPassword(null);
        }

        return staffRepository.save(staff);
    }

    // GET ALL STAFF
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // GET STAFF BY ID
    public Optional<Staff> getStaffById(String id) {
        return staffRepository.findById(id);
    }

    // UPDATE STAFF
    public Staff updateStaff(String id, Staff updatedStaff) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        staff.setName(updatedStaff.getName());
        staff.setRole(updatedStaff.getRole());
        staff.setPhone(updatedStaff.getPhone());
        staff.setEmail(updatedStaff.getEmail());
        staff.setSalary(updatedStaff.getSalary());

        // Encrypt only if password is changed
        if (updatedStaff.getPassword() != null && !updatedStaff.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(updatedStaff.getPassword()));
        }

        return staffRepository.save(staff);
    }

    // DELETE STAFF
    public void deleteStaff(String id) {
        staffRepository.deleteById(id);
    }

    // LOGIN
    public Staff login(String email, String password) {

        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (staff.getPassword() == null) {
            throw new RuntimeException("This account cannot login");
        }

        if (!passwordEncoder.matches(password, staff.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!staff.getRole().equalsIgnoreCase("admin")) {
            throw new RuntimeException("Access denied. Only admin can login.");
        }

        return staff;
    }
}