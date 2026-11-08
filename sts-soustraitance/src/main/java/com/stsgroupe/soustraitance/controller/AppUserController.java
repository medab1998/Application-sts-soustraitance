package com.stsgroupe.soustraitance.controller;

import com.stsgroupe.soustraitance.entity.AppUser;
import com.stsgroupe.soustraitance.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class AppUserController {

    private final AppUserRepository repository;

    public AppUserController(AppUserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<AppUser> getAll() {
        return repository.findAll();
    }

    @PutMapping("/{id}/desactiver")
    public ResponseEntity<AppUser> desactiver(@PathVariable Long id) {
        return repository.findById(id).map(user -> {
            user.setActif(false);
            return ResponseEntity.ok(repository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/activer")
    public ResponseEntity<AppUser> activer(@PathVariable Long id) {
        return repository.findById(id).map(user -> {
            user.setActif(true);
            return ResponseEntity.ok(repository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
