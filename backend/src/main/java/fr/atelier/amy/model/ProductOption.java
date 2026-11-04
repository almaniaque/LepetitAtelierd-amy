package fr.atelier.amy.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "product_option")
public class ProductOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    public Product product;
    public String kind;
    public String label;
    @Column(name = "extra_cents")
    public long extraCents;
    @Column(name = "image_path")
    public String imagePath;
}
