package com.stsgroupe.soustraitance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "mouvement_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MouvementStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idMouvement;

    private LocalDate dateMouvement;

    @Enumerated(EnumType.STRING)
    private TypeMouvement type; // AFFECTATION / CONSOMMATION / RETOUR

    private Integer quantite;

    @ManyToOne
    @JoinColumn(name = "id_sous_traitant", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SousTraitant sousTraitant;

    @ManyToOne
    @JoinColumn(name = "id_produit", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Produit produit;

    @ManyToOne
    @JoinColumn(name = "id_stock", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Stock stock;

    public enum TypeMouvement {
        AFFECTATION, CONSOMMATION, RETOUR
    }
}
