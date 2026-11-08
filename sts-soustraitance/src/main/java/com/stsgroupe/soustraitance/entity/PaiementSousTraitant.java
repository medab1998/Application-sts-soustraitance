package com.stsgroupe.soustraitance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "paiement_sous_traitant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaiementSousTraitant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPaiement;

    private LocalDate datePaiement;
    private Double montantBrut;
    private Double retenue;
    private Double montantNet;
    private String modePaiement;
    private String statut;

    @OneToOne
    @JoinColumn(name = "id_rapport", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private RapportSousTraitant rapport;

    @PrePersist
    @PreUpdate
    private void calculerMontantNet() {
        if (montantBrut != null && retenue != null) {
            this.montantNet = montantBrut - retenue;
        }
    }
}
