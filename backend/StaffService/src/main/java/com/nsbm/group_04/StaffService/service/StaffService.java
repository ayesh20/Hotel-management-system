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

    // Create staff
    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    // Get all staff
    public List<Staff> getAllStaff(){
        return staffRepository.findAll();
    }

    // Get staff by ID
    public Optional<Staff> getStaffById(String id) {
        return staffRepository.findById(id);
    }

    // update staff
    public Staff updateStaff(String id,Staff staff) {
        Optional<Staff> existingStaff = staffRepository.findById(id);

        if (existingStaff.isPresent()) {
            Staff s = existingStaff.get();
            s.setName(staff.getName());
            s.setRole(staff.getRole());
            s.setPhone(staff.getPhone());
            s.setEmail(staff.getEmail());
            s.setSalary(staff.getSalary());
            return staffRepository.save(s);
        } else {
            return null;
        }
    }

}
