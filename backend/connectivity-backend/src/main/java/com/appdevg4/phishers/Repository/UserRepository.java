package com.appdevg4.phishers.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.appdevg4.phishers.Entity.UserEntity;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
}
