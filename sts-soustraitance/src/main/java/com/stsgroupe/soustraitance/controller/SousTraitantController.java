package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.SousTraitant;
import com.stsgroupe.soustraitance.repository.SousTraitantRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sous-traitants")
@CrossOrigin(origins = "*")
public class SousTraitantController {

    private final SousTraitantRepository repository;

    public SousTraitantController(SousTraitantRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SousTraitant> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SousTraitant> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SousTraitant> create(@Valid @RequestBody SousTraitant sousTraitant) {
        SousTraitant saved = repository.save(sousTraitant);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SousTraitant> update(@PathVariable Long id, @Valid @RequestBody SousTraitant details) {
        return repository.findById(id).map(existing -> {
            existing.setRaisonSociale(details.getRaisonSociale());
            existing.setTelephone(details.getTelephone());
            existing.setEmail(details.getEmail());
            existing.setStatut(details.getStatut());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
