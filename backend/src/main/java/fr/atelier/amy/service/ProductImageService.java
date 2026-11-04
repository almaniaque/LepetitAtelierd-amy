package fr.atelier.amy.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ProductImageService {
    private static final long MAX_BYTES = 5L * 1024 * 1024;
    private final Path directory;

    public ProductImageService(@Value("${LPADA_UPLOAD_DIRECTORY:./data/product-images}") String directory) {
        this.directory = Paths.get(directory).toAbsolutePath().normalize();
    }

    public String save(MultipartFile file) {
        if (file == null || file.isEmpty() || file.getSize() > MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photo vide ou supérieure à 5 Mo");
        }
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length > MAX_BYTES)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photo supérieure à 5 Mo");
            String extension = detectExtension(bytes);

            if (extension == null)
                throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "JPG, PNG ou WebP requis");
            Files.createDirectories(directory);

            String filename = UUID.randomUUID() + "." + extension;

            Path target = directory.resolve(filename).normalize();

            if (!target.startsWith(directory))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST);

            Files.write(target, bytes, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);

            return "/api/media/" + filename;

        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Enregistrement de la photo impossible",
                    ex);
        }
    }

    public ImageData load(String filename) {

        if (!filename.matches("[a-f0-9-]{36}\\.(jpg|png|webp)")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Path target = directory.resolve(filename).normalize();

        if (!target.startsWith(directory) || !Files.isRegularFile(target, LinkOption.NOFOLLOW_LINKS))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        try {
            byte[] content = Files.readAllBytes(target);
            String extension = detectExtension(content);

            if (extension == null || !filename.endsWith("." + extension))
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            String type = extension.equals("jpg") ? "image/jpeg" : "image/" + extension;

            return new ImageData(content, MediaType.parseMediaType(type));

        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    private String detectExtension(byte[] b) {
        if (b.length >= 3 && (b[0] & 255) == 0xFF && (b[1] & 255) == 0xD8 && (b[2] & 255) == 0xFF)
            return "jpg";

        if (b.length >= 8 && (b[0] & 255) == 137 && b[1] == 80 && b[2] == 78 && b[3] == 71 && b[4] == 13 && b[5] == 10
                && (b[6] & 255) == 26 && b[7] == 10)
            return "png";

        if (b.length >= 12 && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F' && b[8] == 'W' && b[9] == 'E'
                && b[10] == 'B' && b[11] == 'P')
            return "webp";

        return null;
    }

    public record ImageData(byte[] content, MediaType contentType) {
    }
}
