package ma.provid.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Recommandations nutrition propulsées par l'API Google Gemini.
 * La clé est lue depuis la propriété {@code gemini.api.key} (variable GEMINI_API_KEY).
 * Sans clé ou en cas d'erreur réseau, un conseil de secours est renvoyé.
 */
@RestController
@RequestMapping("/api")
public class NutritionController {

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8)).build();

    @Value("${gemini.api.key:}")
    private String geminiKey;

    @PostMapping("/conseil")
    public Map<String, Object> conseil(@RequestBody Map<String, String> body) {
        String objectif = body.getOrDefault("objectif", "forme générale");
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("objectif", objectif);

        boolean geminiActif = geminiKey != null && !geminiKey.isBlank();
        out.put("geminiActif", geminiActif);

        if (geminiActif) {
            try {
                out.put("recommandation", appelerGemini(objectif));
                out.put("source", "gemini");
                return out;
            } catch (Exception e) {
                // bascule sur le conseil de secours en cas d'erreur
                out.put("erreur", e.getMessage());
            }
        }
        out.put("recommandation", conseilParDefaut(objectif));
        out.put("source", "local");
        return out;
    }

    /** Appel réel à l'API Gemini (REST, generateContent). */
    private String appelerGemini(String objectif) throws Exception {
        String prompt = "Tu es nutritionniste pour une boutique de compléments alimentaires. "
                + "Donne en 3 phrases maximum un conseil concret de complémentation pour l'objectif suivant : "
                + objectif + ". Réponds en français.";

        ObjectNode part = mapper.createObjectNode().put("text", prompt);
        ArrayNode parts = mapper.createArrayNode().add(part);
        ObjectNode content = mapper.createObjectNode();
        content.set("parts", parts);
        ArrayNode contents = mapper.createArrayNode().add(content);
        ObjectNode payload = mapper.createObjectNode();
        payload.set("contents", contents);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GEMINI_URL + geminiKey))
                .timeout(Duration.ofSeconds(15))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
                .build();

        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200)
            throw new RuntimeException("Gemini HTTP " + response.statusCode());

        JsonNode root = mapper.readTree(response.body());
        JsonNode text = root.path("candidates").path(0)
                .path("content").path("parts").path(0).path("text");
        if (text.isMissingNode())
            throw new RuntimeException("Réponse Gemini inattendue");
        return text.asText().trim();
    }

    private String conseilParDefaut(String objectif) {
        return "Pour l'objectif « " + objectif + " » : privilégiez un apport en protéines "
                + "(whey ou caséine), des oméga-3 et un complexe multivitaminé. "
                + "Hydratez-vous et adaptez les portions à votre activité.";
    }
}
