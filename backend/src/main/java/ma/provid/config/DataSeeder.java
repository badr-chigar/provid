package ma.provid.config;

import ma.provid.model.*;
import ma.provid.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategorieRepository categorieRepo;
    private final ProduitRepository produitRepo;
    private final UtilisateurRepository userRepo;

    public DataSeeder(CategorieRepository c, ProduitRepository p, UtilisateurRepository u) {
        this.categorieRepo = c; this.produitRepo = p; this.userRepo = u;
    }

    @Override
    public void run(String... args) {
        if (produitRepo.count() > 0) return;

        Categorie proteines = categorieRepo.save(new Categorie("Protéines"));
        Categorie vitamines  = categorieRepo.save(new Categorie("Vitamines"));
        Categorie energie    = categorieRepo.save(new Categorie("Énergie"));
        Categorie minceur    = categorieRepo.save(new Categorie("Minceur"));

        seed("Whey Protein Isolate 2kg", proteines, "All Stars", 349.0, 40,
             "Isolat de protéine de lactosérum à 90%, faible en sucres, idéal post-entraînement.");
        seed("Caséine Micellaire 1kg", proteines, "BioTech", 245.0, 25,
             "Protéine à diffusion lente, parfaite avant le coucher.");
        seed("Multivitamines Daily 90 caps", vitamines, "Provid Nutrition", 120.0, 60,
             "Complexe complet de 24 vitamines et minéraux essentiels.");
        seed("Oméga-3 Fish Oil 120 caps", vitamines, "Nordic", 160.0, 35,
             "Acides gras EPA/DHA pour le cœur et le cerveau.");
        seed("Créatine Monohydrate 500g", energie, "Provid Nutrition", 190.0, 50,
             "Créatine pure micronisée pour force et volume.");
        seed("Pre-Workout Boost 300g", energie, "All Stars", 220.0, 30,
             "Énergie, focus et congestion avant l'effort.");
        seed("Brûleur de graisse L-Carnitine", minceur, "BioTech", 175.0, 0,
             "L-Carnitine liquide pour soutenir la perte de poids.");
        seed("Barres protéinées (boîte 12)", proteines, "Provid Nutrition", 140.0, 80,
             "20g de protéines par barre, faible en sucre.");

        userRepo.save(new Utilisateur("Admin Provid", "admin@provid.ma", "admin123", "ADMIN"));
        userRepo.save(new Utilisateur("Client Démo", "client@provid.ma", "client123", "CLIENT"));
    }

    private void seed(String nom, Categorie cat, String marque, double prix, int stock, String desc) {
        Produit p = new Produit();
        p.setNom(nom); p.setCategorie(cat); p.setMarque(marque);
        p.setPrix(prix); p.setStock(stock); p.setDescription(desc);
        p.setImage(nom.toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        produitRepo.save(p);
    }
}
