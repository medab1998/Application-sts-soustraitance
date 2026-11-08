package com.stsgroupe.soustraitance.repository;

import com.stsgroupe.soustraitance.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
}
