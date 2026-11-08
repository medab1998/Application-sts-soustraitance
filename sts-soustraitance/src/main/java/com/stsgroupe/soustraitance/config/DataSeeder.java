package com.stsgroupe.soustraitance.config;

import com.stsgroupe.soustraitance.entity.AppUser;
import com.stsgroupe.soustraitance.entity.Role;
import com.stsgroupe.soustraitance.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setEmail("admin@stsgroupe.tn");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMINISTRATEUR);
            admin.setActif(true);
            userRepository.save(admin);
            System.out.println(">>> Compte admin par defaut cree : username=admin / password=Admin@123");
        }
    }
}
