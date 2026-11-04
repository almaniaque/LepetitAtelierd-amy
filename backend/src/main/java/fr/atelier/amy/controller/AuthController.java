package fr.atelier.amy.controller;

import fr.atelier.amy.dto.Requests;
import fr.atelier.amy.model.User;
import fr.atelier.amy.repository.UserRepository;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager auth;

    public AuthController(UserRepository users, PasswordEncoder encoder,
            org.springframework.security.core.userdetails.UserDetailsService details) {
        this.users = users;
        this.encoder = encoder;
        this.auth = new ProviderManager(
                new org.springframework.security.authentication.dao.DaoAuthenticationProvider(details) {
                    {
                        setPasswordEncoder(encoder);
                    }
                });
    }

    @GetMapping("/csrf")
    Map<String, String> csrf(CsrfToken token) {
        return Map.of("token", token.getToken(), "headerName", token.getHeaderName());
    }

    @PostMapping("/auth/register")
    ResponseEntity<?> register(@Valid @RequestBody Requests.Register r) {
        if (users.findByEmailIgnoreCase(r.email()).isPresent())
            return ResponseEntity.status(409).body(Map.of("error", "Email déjà utilisé"));
        User u = new User();
        u.email = r.email().trim().toLowerCase(Locale.ROOT);
        u.passwordHash = encoder.encode(r.password());
        u.fullName = r.fullName().trim();
        users.save(u);
        return ResponseEntity.status(201).body(Map.of("message", "Compte créé"));
    }

    @PostMapping("/auth/login")
    Map<String, String> login(@Valid @RequestBody Requests.Login r, HttpServletRequest req) {
        var result = auth.authenticate(
                new UsernamePasswordAuthenticationToken(r.email().trim().toLowerCase(Locale.ROOT), r.password()));
        req.getSession(true);
        req.changeSessionId();
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(result);
        SecurityContextHolder.setContext(context);
        req.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        return Map.of("role", result.getAuthorities().iterator().next().getAuthority(), "email", result.getName());
    }

    @GetMapping("/auth/me")
    Map<String, String> me(org.springframework.security.core.Authentication a) {
        return Map.of("email", a.getName(), "role", a.getAuthorities().iterator().next().getAuthority());
    }
}
