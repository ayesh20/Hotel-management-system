package com.nsbm.group_04.StaffService.controller;

import com.nsbm.group_04.StaffService.entity.Staff;
import com.nsbm.group_04.StaffService.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:5173")

public class StaffController {

    @Autowired
    private StaffService staffService;

    // CREATE staff
    @PostMapping("/add")
    public ResponseEntity<?> createStaff(@RequestBody Staff staff) {

        Staff savedStaff = staffService.createStaff(staff);

        return ResponseEntity.status(201).body(
                Map.of(
                        "success", true,
                        "message", "Staff created successfully",
                        "data", savedStaff
                )
        );
    }

    // READ all staff
    @GetMapping
    public ResponseEntity<?> getAllStaff() {

        List<Staff> staffList = staffService.getAllStaff();

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "count", staffList.size(),
                        "data", staffList
                )
        );
    }

    //READ staff by ID
    @GetMapping("/{id}")
    public Optional<Staff> getStaffById(@PathVariable String id) {
        return staffService.getStaffById(id);
    }

    // UPDATE staff
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable String id, @RequestBody Staff staff) {

        Staff updatedStaff = staffService.updateStaff(id, staff);

        return ResponseEntity.status(200).body(
                Map.of(
                        "success", true,
                        "message", "Staff updated successfully",
                        "data", updatedStaff
                )
        );
    }

    // DELETE staff
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable String id) {

        staffService.deleteStaff(id);

        return ResponseEntity.status(200).body(
                Map.of(
                        "success", true,
                        "message", "Staff deleted successfully"
                )
        );
    }

}
