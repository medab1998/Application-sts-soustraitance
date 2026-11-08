package com.stsgroupe.soustraitance.repository;

import com.stsgroupe.soustraitance.entity.Contrat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratRepository extends JpaRepository<Contrat, Long> {
    List<Contrat> findBySousTraitant_IdSousTraitant(Long idSousTraitant);
    List<Contrat> findByProjet_IdProjet(Long idProjet);
}
