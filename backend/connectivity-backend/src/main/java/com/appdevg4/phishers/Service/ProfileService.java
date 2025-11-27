package com.appdevg4.phishers.Service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.appdevg4.phishers.Repository.ProfileRepository;
import com.appdevg4.phishers.Repository.UserRepository;
import com.appdevg4.phishers.Entity.ProfileEntity;
import com.appdevg4.phishers.Entity.UserEntity;
import java.time.LocalDateTime;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    // Fetch profile; auto-create if missing
    public ProfileEntity getProfile(Long userId) {
    ProfileEntity profile = profileRepository.findByUserId(userId)
            .orElseGet(() -> {
                UserEntity user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                ProfileEntity newProfile = new ProfileEntity();
                newProfile.setUser(user);
                newProfile.setBio("");
                newProfile.setAvatarUrl("");
                newProfile.setDateUpdated(LocalDateTime.now());
                return profileRepository.save(newProfile);
            });

    // Copy user info to profile fields
    UserEntity user = profile.getUser();
    profile.setFirstName(user.getFname());
    profile.setLastName(user.getLname());
    profile.setEmail(user.getEmail());

    // Save to DB so these fields are persisted
    profile = profileRepository.save(profile);

    return profile;
}


    // Update profile
    public ProfileEntity updateProfile(Long userId, ProfileEntity updatedProfile) {
        ProfileEntity profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserEntity user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    ProfileEntity newProfile = new ProfileEntity();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setFirstName(updatedProfile.getFirstName());
        profile.setLastName(updatedProfile.getLastName());
        profile.setEmail(updatedProfile.getEmail());
        profile.setBio(updatedProfile.getBio());
        profile.setAvatarUrl(updatedProfile.getAvatarUrl());
        profile.setDateUpdated(LocalDateTime.now());

        return profileRepository.save(profile);
    }
}
