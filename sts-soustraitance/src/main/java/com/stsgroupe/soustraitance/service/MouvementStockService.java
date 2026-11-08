package com.stsgroupe.soustraitance.service;

import com.stsgroupe.soustraitance.entity.MouvementStock;
import com.stsgroupe.soustraitance.entity.Stock;
import com.stsgroupe.soustraitance.repository.MouvementStockRepository;
import com.stsgroupe.soustraitance.repository.StockRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class MouvementStockService {

    private final MouvementStockRepository mouvementRepository;
    private final StockRepository stockRepository;

    public MouvementStockService(MouvementStockRepository mouvementRepository,
                                  StockRepository stockRepository) {
        this.mouvementRepository = mouvementRepository;
        this.stockRepository = stockRepository;
    }

    /**
     * Enregistre un mouvement de stock et met a jour la quantite du Stock associe.
     * - AFFECTATION / RETOUR  -> augmente la quantite disponible
     * - CONSOMMATION          -> diminue la quantite disponible
     */
    @Transactional
    public MouvementStock enregistrerMouvement(MouvementStock mouvement) {
        Stock stock = stockRepository.findById(mouvement.getStock().getIdStock())
                .orElseThrow(() -> new IllegalArgumentException("Stock introuvable"));

        int quantiteActuelle = stock.getQuantiteActuelle() == null ? 0 : stock.getQuantiteActuelle();

        switch (mouvement.getType()) {
            case CONSOMMATION -> {
                if (quantiteActuelle < mouvement.getQuantite()) {
                    throw new IllegalStateException("Quantite insuffisante en stock");
                }
                stock.setQuantiteActuelle(quantiteActuelle - mouvement.getQuantite());
            }
            case AFFECTATION, RETOUR -> stock.setQuantiteActuelle(quantiteActuelle + mouvement.getQuantite());
        }

        stockRepository.save(stock);
        return mouvementRepository.save(mouvement);
    }
}
