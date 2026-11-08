package com.stsgroupe.soustraitance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "sous_traitant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SousTraitant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSousTraitant;

    @NotBlank(message = "La raison sociale est obligatoire")
    private String raisonSociale;

    private String telephone;

    @Email(message = "Email invalide")
    private String email;

    private String statut; // ACTIF / INACTIF / SUSPENDU
}
