package fr.atelier.amy.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @Column(nullable = false, unique = true)
    public String email;
    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    public String passwordHash;
    @Column(name = "full_name", nullable = false)
    public String fullName;
    @Column(nullable = false)
    public String role = "CUSTOMER";
}
