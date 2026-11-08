package com.stsgroupe.soustraitance.repository;

import com.stsgroupe.soustraitance.entity.SousTraitant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SousTraitantRepository extends JpaRepository<SousTraitant, Long> {
}
