package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.MouvementStock;
import com.stsgroupe.soustraitance.repository.MouvementStockRepository;
import com.stsgroupe.soustraitance.service.MouvementStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mouvements-stock")
@CrossOrigin(origins = "*")
public class MouvementStockController {

    private final MouvementStockRepository repository;
    private final MouvementStockService service;

    public MouvementStockController(MouvementStockRepository repository, MouvementStockService service) {
        this.repository = repository;
        this.service = service;
    }

    @GetMapping
    public List<MouvementStock> getAll() {
        return repository.findAll();
    }

    @GetMapping("/sous-traitant/{idSousTraitant}")
    public List<MouvementStock> getBySousTraitant(@PathVariable Long idSousTraitant) {
        return repository.findBySousTraitant_IdSousTraitant(idSousTraitant);
    }

    // Cree le mouvement ET met a jour automatiquement la quantite du Stock
    @PostMapping
    public ResponseEntity<?> create(@RequestBody MouvementStock mouvement) {
        try {
            return ResponseEntity.ok(service.enregistrerMouvement(mouvement));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
