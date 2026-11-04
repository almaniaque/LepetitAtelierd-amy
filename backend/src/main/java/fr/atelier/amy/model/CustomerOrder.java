package fr.atelier.amy.model;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "customer_order")
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    public User user;
    public String status = "PENDING";
    @Column(name = "payment_status")
    public String paymentStatus = "UNPAID";
    @Column(name = "total_cents")
    public long totalCents;
    @Column(name = "customer_note")
    public String customerNote;
    @Column(name = "created_at", insertable = false, updatable = false)
    public Instant createdAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    public List<OrderLine> lines = new ArrayList<>();
}
