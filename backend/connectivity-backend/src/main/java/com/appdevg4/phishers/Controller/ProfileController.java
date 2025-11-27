package com.appdevg4.phishers.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.appdevg4.phishers.Service.ProfileService;
import com.appdevg4.phishers.Entity.ProfileEntity;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/{userId}")
    public ProfileEntity getProfile(@PathVariable Long userId) {
        return profileService.getProfile(userId);
    }

    @PutMapping("/{userId}")
    public ProfileEntity updateProfile(@PathVariable Long userId, @RequestBody ProfileEntity profile) {
        return profileService.updateProfile(userId, profile);
    }
}
