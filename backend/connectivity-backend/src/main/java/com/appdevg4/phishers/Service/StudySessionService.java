package com.appdevg4.phishers.Service;

import com.appdevg4.phishers.Entity.StudySessionEntity;
import com.appdevg4.phishers.Repository.StudySessionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudySessionService {

    private final StudySessionRepository repo;

    public StudySessionService(StudySessionRepository repo) {
        this.repo = repo;
    }

    public StudySessionEntity saveSession(StudySessionEntity session) {
        return repo.save(session);
    }

    public List<StudySessionEntity> getSessions(Long userId) {
        return repo.findByUserId(userId);
    }
}
