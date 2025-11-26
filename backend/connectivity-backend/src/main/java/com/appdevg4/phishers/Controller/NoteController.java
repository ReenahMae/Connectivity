package com.appdevg4.phishers.Controller;

import com.appdevg4.phishers.Entity.NoteEntity;
import com.appdevg4.phishers.Service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    @GetMapping
    public List<NoteEntity> getNotes(@RequestParam Long userId) {
        return service.getNotesByUser(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteEntity> getNote(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        return service.getNote(id, userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public NoteEntity create(@RequestBody NoteEntity note) {
        return service.createNote(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteEntity> update(
            @PathVariable Long id,
            @RequestBody NoteEntity updated,
            @RequestParam Long userId
    ) {
        return service.updateNote(id, userId, updated)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam Long userId
    ) {
        boolean deleted = service.deleteNote(id, userId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
