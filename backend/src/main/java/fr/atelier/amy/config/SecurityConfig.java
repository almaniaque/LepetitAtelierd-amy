package fr.atelier.amy.config;

import fr.atelier.amy.repository.UserRepository;
import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
public class SecurityConfig {
    @Value("${COOKIE_SECURE:true}")
    private boolean secureCookies;

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    UserDetailsService userDetailsService(UserRepository repo) {
        return email -> repo.findByEmailIgnoreCase(email)
                .map(u -> User.withUsername(u.email).password(u.passwordHash).roles(u.role).build())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur inconnu"));
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        var csrfRepo = CookieCsrfTokenRepository.withHttpOnlyFalse();
        csrfRepo.setCookieCustomizer(c -> c.path("/").sameSite("Lax").secure(secureCookies));
        var handler = new CsrfTokenRequestAttributeHandler();
        handler.setCsrfRequestAttributeName(null);
        http.csrf(csrf -> csrf.csrfTokenRepository(csrfRepo).csrfTokenRequestHandler(handler))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories", "/api/csrf").permitAll()
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .formLogin(f -> f.disable()).httpBasic(b -> b.disable())
                .logout(l -> l.logoutUrl("/api/auth/logout").deleteCookies("LPADA_SESSION").invalidateHttpSession(true))
                .sessionManagement(s -> s.sessionFixation(f -> f.changeSessionId()));
        return http.build();
    }
}
