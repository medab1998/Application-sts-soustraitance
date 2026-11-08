package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.Contrat;
import com.stsgroupe.soustraitance.repository.ContratRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@CrossOrigin(origins = "*")
public class ContratController {

    private final ContratRepository repository;

    public ContratController(ContratRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Contrat> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrat> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sous-traitant/{idSousTraitant}")
    public List<Contrat> getBySousTraitant(@PathVariable Long idSousTraitant) {
        return repository.findBySousTraitant_IdSousTraitant(idSousTraitant);
    }

    @GetMapping("/projet/{idProjet}")
    public List<Contrat> getByProjet(@PathVariable Long idProjet) {
        return repository.findByProjet_IdProjet(idProjet);
    }

    @PostMapping
    public Contrat create(@RequestBody Contrat contrat) {
        return repository.save(contrat);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contrat> update(@PathVariable Long id, @RequestBody Contrat details) {
        return repository.findById(id).map(existing -> {
            existing.setNumeroContrat(details.getNumeroContrat());
            existing.setDateDebut(details.getDateDebut());
            existing.setDateFin(details.getDateFin());
            existing.setMontantTotal(details.getMontantTotal());
            existing.setRetenueGarantie(details.getRetenueGarantie());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
