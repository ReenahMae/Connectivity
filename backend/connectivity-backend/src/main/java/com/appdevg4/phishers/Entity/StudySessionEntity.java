package com.appdevg4.phishers.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "study_sessions")
@Data
public class StudySessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;


    private String mode;

    @Column(name = "focus_minutes")
    private int focusMinutes;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

}
