package com.stsgroupe.soustraitance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "rapport_sous_traitant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RapportSousTraitant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRapport;

    private LocalDate dateRapport;
    private String descriptionTravaux;
    private Double pourcentageAvancement;
    private Integer quantiteRealisee;

    @Enumerated(EnumType.STRING)
    private StatutRapport statut; // BROUILLON / SOUMIS / APPROUVE / REJETE

    @ManyToOne
    @JoinColumn(name = "id_contrat", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Contrat contrat;

    public enum StatutRapport {
        BROUILLON, SOUMIS, APPROUVE, REJETE
    }
}
