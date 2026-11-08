package com.stsgroupe.soustraitance.repository;

import com.stsgroupe.soustraitance.entity.PieceJointe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PieceJointeRepository extends JpaRepository<PieceJointe, Long> {
}
