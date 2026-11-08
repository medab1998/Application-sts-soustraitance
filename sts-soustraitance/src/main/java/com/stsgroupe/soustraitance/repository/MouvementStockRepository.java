package com.stsgroupe.soustraitance.repository;

import com.stsgroupe.soustraitance.entity.MouvementStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {
    List<MouvementStock> findBySousTraitant_IdSousTraitant(Long idSousTraitant);
}
