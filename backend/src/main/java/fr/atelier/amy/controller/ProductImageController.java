package fr.atelier.amy.controller;

import fr.atelier.amy.service.ProductImageService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController

public class ProductImageController {
    private final ProductImageService images;

    public ProductImageController(ProductImageService images) {
        this.images = images;
    }

    @PostMapping(value = "/api/admin/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)

    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        return Map.of("imagePath", images.save(file));
    }

    @GetMapping("/api/media/{filename:.+}")
    public ResponseEntity<byte[]> display(@PathVariable String filename) {
        var img = images.load(filename);

        return ResponseEntity.ok().contentType(img.contentType())
                .cacheControl(CacheControl.noCache()).header("X-Content-Type-Options", "nosniff")
                .body(img.content());
    }
}
