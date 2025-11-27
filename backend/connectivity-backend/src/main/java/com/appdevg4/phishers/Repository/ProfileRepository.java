package com.appdevg4.phishers.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdevg4.phishers.Entity.ProfileEntity;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    Optional<ProfileEntity> findByUserId(Long userId);
}
