package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.PieceJointe;
import com.stsgroupe.soustraitance.repository.PieceJointeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pieces-jointes")
@CrossOrigin(origins = "*")
public class PieceJointeController {

    private final PieceJointeRepository repository;

    public PieceJointeController(PieceJointeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<PieceJointe> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public PieceJointe create(@RequestBody PieceJointe pieceJointe) {
        return repository.save(pieceJointe);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
