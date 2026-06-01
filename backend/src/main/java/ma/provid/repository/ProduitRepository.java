package ma.provid.repository;

import ma.provid.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByActifTrue();
    List<Produit> findByCategorieId(Long categorieId);
}
