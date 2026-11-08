package com.stsgroupe.soustraitance.repository;

import com.stsgroupe.soustraitance.entity.PaiementSousTraitant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiementSousTraitantRepository extends JpaRepository<PaiementSousTraitant, Long> {
}
