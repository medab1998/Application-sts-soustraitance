package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.Stock;
import com.stsgroupe.soustraitance.repository.StockRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockRepository repository;

    public StockController(StockRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Stock> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getById(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Stock create(@RequestBody Stock stock) {
        return repository.save(stock);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> update(@PathVariable Long id, @RequestBody Stock details) {
        return repository.findById(id).map(existing -> {
            existing.setQuantiteActuelle(details.getQuantiteActuelle());
            existing.setStockMinimum(details.getStockMinimum());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}
