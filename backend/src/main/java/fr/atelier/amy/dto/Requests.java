package fr.atelier.amy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public final class Requests {
        private Requests() {
        }

        public record Register(@Email @NotBlank String email, @NotBlank @Size(min = 12, max = 100) String password,
                        @NotBlank @Size(max = 120) String fullName) {
        }

        public record Login(@Email @NotBlank String email, @NotBlank String password) {
        }

        public record Line(@NotNull Long productId, @Min(1) @Max(50) int quantity, List<Long> optionIds) {
        }

        public record Checkout(@NotEmpty List<@Valid Line> lines, @Size(max = 2000) String note, boolean acceptsCgv) {
        }

        public record ProductEdit(@NotNull Long categoryId, @NotBlank String name, String description, String imagePath,
                        @Min(0) long priceCents, boolean active) {
        }

        public record Status(@NotBlank String status) {
        }

        public record Payment(@NotBlank String paymentStatus) {
        }
}
