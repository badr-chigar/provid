package ma.provid.repository;

import ma.provid.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findAllByOrderByCreeLeDesc();
    long countByStatut(String statut);
}
