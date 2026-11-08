package com.stsgroupe.soustraitance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "contrat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idContrat;

    private String numeroContrat;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Double montantTotal;
    private Double retenueGarantie;

    @ManyToOne
    @JoinColumn(name = "id_sous_traitant", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SousTraitant sousTraitant;

    @ManyToOne
    @JoinColumn(name = "id_projet", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Projet projet;
}
