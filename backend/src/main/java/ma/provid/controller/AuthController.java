package ma.provid.controller;

import ma.provid.dto.LoginRequest;
import ma.provid.model.Utilisateur;
import ma.provid.repository.UtilisateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository userRepo;

    public AuthController(UtilisateurRepository u) { this.userRepo = u; }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Utilisateur u = userRepo.findByEmail(req.getEmail()).orElse(null);
        if (u == null || !u.getMotDePasse().equals(req.getMotDePasse()))
            return ResponseEntity.status(401).body(Map.of("error", "Identifiants invalides"));
        String token = Base64.getEncoder().encodeToString((u.getEmail() + ":" + u.getRole()).getBytes());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of("id", u.getId(), "nom", u.getNom(), "email", u.getEmail(), "role", u.getRole())
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur u) {
        if (userRepo.existsByEmail(u.getEmail()))
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        u.setRole("CLIENT");
        return ResponseEntity.ok(userRepo.save(u));
    }
}
