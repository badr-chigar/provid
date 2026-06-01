package ma.provid.controller;

import ma.provid.model.Categorie;
import ma.provid.model.Produit;
import ma.provid.repository.CategorieRepository;
import ma.provid.repository.ProduitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProduitController {

    private final ProduitRepository produitRepo;
    private final CategorieRepository categorieRepo;

    public ProduitController(ProduitRepository p, CategorieRepository c) {
        this.produitRepo = p; this.categorieRepo = c;
    }

    // Boutique : produits actifs
    @GetMapping("/produits")
    public List<Produit> boutique() { return produitRepo.findByActifTrue(); }

    // Admin : tous les produits
    @GetMapping("/admin/produits")
    public List<Produit> tous() { return produitRepo.findAll(); }

    @GetMapping("/produits/{id}")
    public ResponseEntity<Produit> un(@PathVariable Long id) {
        return produitRepo.findById(id).map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categories")
    public List<Categorie> categories() { return categorieRepo.findAll(); }

    @PostMapping("/admin/produits")
    public Produit creer(@RequestBody Produit p) { return produitRepo.save(p); }

    @PutMapping("/admin/produits/{id}")
    public ResponseEntity<Produit> modifier(@PathVariable Long id, @RequestBody Produit data) {
        return produitRepo.findById(id).map(p -> {
            p.setNom(data.getNom());
            p.setDescription(data.getDescription());
            p.setPrix(data.getPrix());
            p.setStock(data.getStock());
            p.setMarque(data.getMarque());
            p.setCategorie(data.getCategorie());
            p.setActif(data.isActif());
            return ResponseEntity.ok(produitRepo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/admin/produits/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        produitRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
