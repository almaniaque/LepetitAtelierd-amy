package fr.atelier.amy.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    public Category category;
    public String name;
    @Column(columnDefinition = "text")
    public String description = "";
    @Column(name = "image_path")
    public String imagePath;
    @Column(name = "price_cents")
    public long priceCents;
    public boolean active = true;
    @Column(name = "made_to_order")
    public boolean madeToOrder = true;
    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ProductOption> options = new ArrayList<>();
}
