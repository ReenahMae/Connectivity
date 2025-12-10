package com.appdevg4.phishers.Repository;

import com.appdevg4.phishers.Entity.StudySessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudySessionRepository extends JpaRepository<StudySessionEntity, Long> {
    List<StudySessionEntity> findByUserId(Long userId);
}
