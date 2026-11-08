package com.stsgroupe.soustraitance.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // active @PreAuthorize sur les controleurs
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AppUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, AppUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // necessaire pour /h2-console
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Endpoints publics
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // ===== Regles par role, alignees sur le diagramme de cas d'utilisation =====

                // Gestion des utilisateurs -> Administrateur uniquement
                .requestMatchers("/api/users/**").hasRole("ADMINISTRATEUR")

                // Sous-traitants : lecture ouverte aux roles de gestion, ecriture reservee
                .requestMatchers("GET", "/api/sous-traitants/**")
                    .hasAnyRole("ADMINISTRATEUR", "CHEF_PROJET", "RESPONSABLE_ACHAT")
                .requestMatchers("POST", "/api/sous-traitants/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("PUT", "/api/sous-traitants/**").hasRole("ADMINISTRATEUR")
                .requestMatchers("DELETE", "/api/sous-traitants/**").hasRole("ADMINISTRATEUR")

                // Contrats : gere par Responsable Achat / Chef Projet / Admin
                .requestMatchers("/api/contrats/**")
                    .hasAnyRole("ADMINISTRATEUR", "CHEF_PROJET", "RESPONSABLE_ACHAT")

                // Mouvements de stock : le sous-traitant declare, achat/admin consultent
                .requestMatchers("POST", "/api/mouvements-stock/**")
                    .hasAnyRole("SOUS_TRAITANT", "RESPONSABLE_ACHAT", "ADMINISTRATEUR")
                .requestMatchers("GET", "/api/mouvements-stock/**")
                    .hasAnyRole("SOUS_TRAITANT", "RESPONSABLE_ACHAT", "ADMINISTRATEUR", "CHEF_PROJET")

                // Rapports sous-traitant : le sous-traitant cree/consulte, chef projet valide
                .requestMatchers("POST", "/api/rapports-sous-traitant/**")
                    .hasAnyRole("SOUS_TRAITANT", "ADMINISTRATEUR")
                .requestMatchers("PUT", "/api/rapports-sous-traitant/*/statut")
                    .hasAnyRole("CHEF_PROJET", "ADMINISTRATEUR")
                .requestMatchers("GET", "/api/rapports-sous-traitant/**")
                    .hasAnyRole("SOUS_TRAITANT", "CHEF_PROJET", "ADMINISTRATEUR")

                // Paiements sous-traitant : reserve a la finance/admin
                .requestMatchers("/api/paiements-sous-traitant/**")
                    .hasAnyRole("RESPONSABLE_FACTURATION", "RESPONSABLE_REGLEMENT", "ADMINISTRATEUR")

                // Reclamations : technicien et sous-traitant peuvent declarer
                .requestMatchers("POST", "/api/reclamations/**")
                    .hasAnyRole("TECHNICIEN", "SOUS_TRAITANT", "ADMINISTRATEUR")

                // Tout le reste necessite au minimum d'etre authentifie
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
