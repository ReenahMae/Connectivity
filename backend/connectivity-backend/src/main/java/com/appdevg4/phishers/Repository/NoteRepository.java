package com.appdevg4.phishers.Repository;

import com.appdevg4.phishers.Entity.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {
    List<NoteEntity> findByUserIdOrderByModifiedDesc(Long userId);
}
