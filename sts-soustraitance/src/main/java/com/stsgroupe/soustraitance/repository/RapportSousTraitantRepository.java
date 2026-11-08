package com.stsgroupe.soustraitance.repository;

import com.stsgroupe.soustraitance.entity.RapportSousTraitant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RapportSousTraitantRepository extends JpaRepository<RapportSousTraitant, Long> {
    List<RapportSousTraitant> findByContrat_IdContrat(Long idContrat);
}
