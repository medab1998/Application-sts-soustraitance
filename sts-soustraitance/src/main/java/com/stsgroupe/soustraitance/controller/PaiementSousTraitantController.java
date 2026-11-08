package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.PaiementSousTraitant;
import com.stsgroupe.soustraitance.repository.PaiementSousTraitantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements-sous-traitant")
@CrossOrigin(origins = "*")
public class PaiementSousTraitantController {

    private final PaiementSousTraitantRepository repository;

    public PaiementSousTraitantController(PaiementSousTraitantRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<PaiementSousTraitant> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaiementSousTraitant> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // montantNet est calcule automatiquement (montantBrut - retenue) via @PrePersist/@PreUpdate
    @PostMapping
    public PaiementSousTraitant create(@RequestBody PaiementSousTraitant paiement) {
        return repository.save(paiement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
