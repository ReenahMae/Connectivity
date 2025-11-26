package com.appdevg4.phishers.Service;

import com.appdevg4.phishers.Entity.NoteEntity;
import com.appdevg4.phishers.Repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository repo;

    public NoteService(NoteRepository repo) {
        this.repo = repo;
    }

    public List<NoteEntity> getNotesByUser(Long userId) {
        return repo.findByUserIdOrderByModifiedDesc(userId);
    }

    public Optional<NoteEntity> getNote(Long id, Long userId) {
        return repo.findById(id)
                .filter(n -> n.getUserId().equals(userId));
    }

    public NoteEntity createNote(NoteEntity note) {
        return repo.save(note);
    }

    public Optional<NoteEntity> updateNote(Long id, Long userId, NoteEntity data) {
        return repo.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .map(existing -> {
                    existing.setTitle(data.getTitle());
                    existing.setBody(data.getBody());
                    return repo.save(existing);
                });
    }

    public boolean deleteNote(Long id, Long userId) {
        return repo.findById(id)
                .filter(n -> n.getUserId().equals(userId))
                .map(n -> {
                    repo.delete(n);
                    return true;
                }).orElse(false);
    }
}
