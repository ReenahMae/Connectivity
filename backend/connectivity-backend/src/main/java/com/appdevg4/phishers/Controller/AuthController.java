package com.appdevg4.phishers.Controller;
import com.appdevg4.phishers.util.JwtUtil;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;


import com.appdevg4.phishers.Service.UserService;
import com.appdevg4.phishers.Entity.UserEntity;
import com.appdevg4.phishers.dto.UserDTO;
import com.appdevg4.phishers.dto.ApiResponse;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

     @Autowired
    private JwtUtil jwtUtil;

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> registerUser(@RequestBody Map<String, String> body) {
        try {
            String fname = body.get("fname");
            String lname = body.get("lname");
            String email = body.get("email");
            String password = body.get("password");

            UserEntity savedUser = userService.registerUser(fname, lname, email, password);
            UserDTO dto = new UserDTO(savedUser.getFname(), savedUser.getLname(), savedUser.getEmail());

            ApiResponse<UserDTO> response = new ApiResponse<>("User registered successfully", dto);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse<UserDTO> response = new ApiResponse<>("Error: " + e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // --- LOGIN ---
   @PostMapping("/login")
public ResponseEntity<ApiResponse<Map<String, String>>> loginUser(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    String password = body.get("password");

    UserEntity user = userService.loginUser(email, password);

    if (user != null) {
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Prepare response data
        Map<String, String> data = Map.of(
            "id", user.getId().toString(),
            "fname", user.getFname(),
            "lname", user.getLname(),
            "email", user.getEmail(),
            "token", token
        );

        ApiResponse<Map<String, String>> response = new ApiResponse<>("Login successful", data);
        return ResponseEntity.ok(response);
    } else {
        ApiResponse<Map<String, String>> response = new ApiResponse<>("Invalid credentials", null);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}

    // --- GET ALL USERS ---
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers()
                                         .stream()
                                         .map(u -> new UserDTO(u.getFname(), u.getLname(), u.getEmail()))
                                         .toList();
        ApiResponse<List<UserDTO>> response = new ApiResponse<>("Users fetched successfully", users);
        return ResponseEntity.ok(response);
    }
}
