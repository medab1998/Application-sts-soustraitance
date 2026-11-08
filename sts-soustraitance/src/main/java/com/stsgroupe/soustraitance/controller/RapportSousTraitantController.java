package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.RapportSousTraitant;
import com.stsgroupe.soustraitance.repository.RapportSousTraitantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports-sous-traitant")
@CrossOrigin(origins = "*")
public class RapportSousTraitantController {

    private final RapportSousTraitantRepository repository;

    public RapportSousTraitantController(RapportSousTraitantRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<RapportSousTraitant> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RapportSousTraitant> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/contrat/{idContrat}")
    public List<RapportSousTraitant> getByContrat(@PathVariable Long idContrat) {
        return repository.findByContrat_IdContrat(idContrat);
    }

    @PostMapping
    public RapportSousTraitant create(@RequestBody RapportSousTraitant rapport) {
        if (rapport.getStatut() == null) {
            rapport.setStatut(RapportSousTraitant.StatutRapport.BROUILLON);
        }
        return repository.save(rapport);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<RapportSousTraitant> changerStatut(@PathVariable Long id,
                                                              @RequestParam RapportSousTraitant.StatutRapport statut) {
        return repository.findById(id).map(existing -> {
            existing.setStatut(statut);
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
