package com.nsbm.group_04.StaffService.controller;

import com.nsbm.group_04.StaffService.entity.Staff;
import com.nsbm.group_04.StaffService.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
