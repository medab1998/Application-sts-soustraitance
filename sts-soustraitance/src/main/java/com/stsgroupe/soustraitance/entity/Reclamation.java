package com.stsgroupe.soustraitance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "reclamation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReclamation;

    private LocalDate dateDeclaration;

    @Enumerated(EnumType.STRING)
    private TypeReclamation type; // INCIDENT / ACCIDENT / HSE

    private String description;
    private String statut;

    @Enumerated(EnumType.STRING)
    private DeclarePar declarePar; // TECHNICIEN / SOUS_TRAITANT

    @ManyToOne
    @JoinColumn(name = "id_rapport")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private RapportSousTraitant rapport; // nullable : peut aussi venir du Technicien hors module ST

    public enum TypeReclamation {
        INCIDENT, ACCIDENT, HSE
    }

    public enum DeclarePar {
        TECHNICIEN, SOUS_TRAITANT
    }
}
