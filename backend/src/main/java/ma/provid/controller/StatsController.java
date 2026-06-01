package ma.provid.controller;

import ma.provid.repository.CommandeRepository;
import ma.provid.repository.ProduitRepository;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class StatsController {

    private final ProduitRepository produitRepo;
    private final CommandeRepository commandeRepo;

    public StatsController(ProduitRepository p, CommandeRepository c) {
        this.produitRepo = p; this.commandeRepo = c;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("produits", produitRepo.count());
        m.put("commandes", commandeRepo.count());
        m.put("enAttente", commandeRepo.countByStatut("EN_ATTENTE"));
        double ca = commandeRepo.findAll().stream().mapToDouble(c -> c.getTotal()).sum();
        m.put("chiffreAffaires", Math.round(ca * 100.0) / 100.0);
        long rupture = produitRepo.findAll().stream().filter(p -> p.getStock() == 0).count();
        m.put("ruptures", rupture);
        return m;
    }
}
