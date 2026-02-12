package com.nsbm.group_04.StaffService.service;

import com.nsbm.group_04.StaffService.entity.Staff;
import com.nsbm.group_04.StaffService.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;

    // Create staff
    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

}
