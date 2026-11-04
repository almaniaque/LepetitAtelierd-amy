package fr.atelier.amy;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;
class PasswordSecurityTest {
  @Test void bcryptNeverStoresPlaintext() {
    var encoder = new BCryptPasswordEncoder(12);
    String plain = "MotDePasseDeTest!2026";
    String hash = encoder.encode(plain);
    assertNotEquals(plain, hash);
    assertTrue(hash.startsWith("$2"));
    assertTrue(encoder.matches(plain, hash));
    assertFalse(encoder.matches("incorrect", hash));
  }
}
