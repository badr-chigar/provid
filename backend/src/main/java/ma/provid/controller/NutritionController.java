package ma.provid.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Recommandations nutrition. En production, ce contrôleur appelle l'API Google Gemini
 * (clé via la variable gemini.api.key). Sans clé, il renvoie un conseil par défaut.
 */
@RestController
@RequestMapping("/api")
public class NutritionController {

    @Value("${gemini.api.key:}")
    private String geminiKey;

    @PostMapping("/conseil")
    public Map<String, Object> conseil(@RequestBody Map<String, String> body) {
        String objectif = body.getOrDefault("objectif", "forme générale");
        boolean geminiActif = geminiKey != null && !geminiKey.isBlank();
        // NB : l'appel réel à Gemini se brancherait ici (RestTemplate/WebClient).
        String message = "Pour l'objectif « " + objectif + " » : privilégiez un apport en "
                + "protéines (whey ou caséine), des oméga-3 et un complexe multivitaminé. "
                + "Hydratez-vous et adaptez les portions à votre activité.";
        return Map.of("objectif", objectif, "geminiActif", geminiActif, "recommandation", message);
    }
}
