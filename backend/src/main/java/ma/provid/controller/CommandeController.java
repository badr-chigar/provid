package ma.provid.controller;

import ma.provid.dto.CommandeRequest;
import ma.provid.dto.PanierItem;
import ma.provid.model.Commande;
import ma.provid.model.LigneCommande;
import ma.provid.model.Produit;
import ma.provid.repository.CommandeRepository;
import ma.provid.repository.ProduitRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommandeController {

    private final CommandeRepository commandeRepo;
    private final ProduitRepository produitRepo;

    public CommandeController(CommandeRepository c, ProduitRepository p) {
        this.commandeRepo = c; this.produitRepo = p;
    }

    @PostMapping("/commandes")
    public ResponseEntity<?> creer(@RequestBody CommandeRequest req) {
        if (req.getItems() == null || req.getItems().isEmpty())
            return ResponseEntity.badRequest().body(Map.of("error", "Panier vide"));

        Commande cmd = new Commande();
        cmd.setReference("CMD-" + System.currentTimeMillis());
        cmd.setClientNom(req.getClientNom());
        cmd.setClientEmail(req.getClientEmail());
        cmd.setAdresse(req.getAdresse());

        double total = 0;
        for (PanierItem item : req.getItems()) {
            Produit p = produitRepo.findById(item.getProduitId()).orElse(null);
            if (p == null) continue;
            if (p.getStock() < item.getQuantite())
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Stock insuffisant pour " + p.getNom()));
            LigneCommande l = new LigneCommande();
            l.setProduitNom(p.getNom());
            l.setPrixUnitaire(p.getPrix());
            l.setQuantite(item.getQuantite());
            l.setCommande(cmd);
            cmd.getLignes().add(l);
            total += p.getPrix() * item.getQuantite();
            p.setStock(p.getStock() - item.getQuantite()); // décrément du stock
            produitRepo.save(p);
        }
        cmd.setTotal(total);
        return ResponseEntity.ok(commandeRepo.save(cmd));
    }

    @GetMapping("/admin/commandes")
    public List<Commande> toutes() { return commandeRepo.findAllByOrderByCreeLeDesc(); }

    @PatchMapping("/admin/commandes/{id}/statut")
    public ResponseEntity<Commande> statut(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return commandeRepo.findById(id).map(c -> {
            c.setStatut(body.get("statut"));
            return ResponseEntity.ok(commandeRepo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }
}
