package com.nsbm.group_04.StaffService.controller;

import com.nsbm.group_04.StaffService.dto.LoginRequest;
import com.nsbm.group_04.StaffService.dto.LoginResponse;
import com.nsbm.group_04.StaffService.entity.Staff;
import com.nsbm.group_04.StaffService.security.JwtService;
import com.nsbm.group_04.StaffService.service.StaffService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final StaffService staffService;
    private final JwtService jwtService;

    public AuthController(StaffService staffService, JwtService jwtService) {
        this.staffService = staffService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Staff staff = staffService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(staff.getEmail());

        return new LoginResponse(
                token,
                staff.getEmail(),
                staff.getRole()
        );
    }
}