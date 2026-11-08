package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.Projet;
import com.stsgroupe.soustraitance.repository.ProjetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projets")
@CrossOrigin(origins = "*")
public class ProjetController {

    private final ProjetRepository repository;

    public ProjetController(ProjetRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Projet> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projet> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Projet create(@RequestBody Projet projet) {
        return repository.save(projet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
