package com.appdevg4.phishers.Controller;

import com.appdevg4.phishers.Entity.StudySessionEntity;
import com.appdevg4.phishers.Service.StudySessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timer")
@CrossOrigin(origins = "*")
public class StudySessionController {

    private final StudySessionService service;

    public StudySessionController(StudySessionService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public StudySessionEntity saveSession(@RequestBody StudySessionEntity session) {
        return service.saveSession(session);
    }

    @GetMapping("/{userId}")
    public List<StudySessionEntity> getSessions(@PathVariable Long userId) {
        return service.getSessions(userId);
    }
}
