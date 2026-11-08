package com.stsgroupe.soustraitance.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "piece_jointe")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PieceJointe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPiece;

    private LocalDate dateCapture;
    private String cheminFichier;

    @Enumerated(EnumType.STRING)
    private TypePiece type; // PHOTO / PDF / DOCUMENT

    @ManyToOne
    @JoinColumn(name = "id_rapport", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private RapportSousTraitant rapport;

    public enum TypePiece {
        PHOTO, PDF, DOCUMENT
    }
}
