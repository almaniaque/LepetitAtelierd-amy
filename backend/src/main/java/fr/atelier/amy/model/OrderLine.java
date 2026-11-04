package fr.atelier.amy.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "order_line")
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    public CustomerOrder order;
    @Column(name = "product_name")
    public String productName;
    public int quantity;
    @Column(name = "unit_price_cents")
    public long unitPriceCents;
    @Column(name = "options_snapshot")
    public String optionsSnapshot;
}
