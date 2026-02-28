package com.nsbm.group_04.StaffService.service;

import com.nsbm.group_04.StaffService.entity.Staff;
import com.nsbm.group_04.StaffService.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

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
        staff.setPassword(updatedStaff.getPassword());
        staff.setSalary(updatedStaff.getSalary());

        return staffRepository.save(staff);
    }
    // DELETE STAFF
    public void deleteStaff(String id) {
        staffRepository.deleteById(id);
    }

    // LOGIN
    public Staff login(String email, String password) {

        Staff staff = staffRepository.findByEmailAndPassword(email, password)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check role is admin
        if (!staff.getRole().equalsIgnoreCase("admin")) {
            throw new RuntimeException("Access denied. Only admin can login.");
        }

        return staff;
    }
}