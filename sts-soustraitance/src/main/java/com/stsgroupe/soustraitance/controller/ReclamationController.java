package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.Reclamation;
import com.stsgroupe.soustraitance.repository.ReclamationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
@CrossOrigin(origins = "*")
public class ReclamationController {

    private final ReclamationRepository repository;

    public ReclamationController(ReclamationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Reclamation> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reclamation> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reclamation create(@RequestBody Reclamation reclamation) {
        return repository.save(reclamation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
