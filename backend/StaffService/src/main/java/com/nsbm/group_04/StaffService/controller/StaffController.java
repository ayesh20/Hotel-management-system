package com.nsbm.group_04.StaffService.controller;

import com.nsbm.group_04.StaffService.entity.Staff;
import com.nsbm.group_04.StaffService.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "http://localhost:5173")

public class StaffController {

    @Autowired
    private StaffService staffService;

    // CREATE staff
    @PostMapping
    public Staff createStaff(@RequestBody Staff staff) {
        return staffService.createStaff(staff);
    }

    // READ all staff
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    //READ staff by ID
    @GetMapping("/{id}")
    public Optional<Staff> getStaffById(@PathVariable String id) {
        return staffService.getStaffById(id);
    }

    // UPDATE staff
    @PutMapping("/{id}")
    public Staff updateStaff(@PathVariable String id, @RequestBody Staff staff) {
        return staffService.updateStaff(id,staff);
    }

    // DELETE staff
    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable String id) {
        staffService.deleteStaff(id);
    }

}
