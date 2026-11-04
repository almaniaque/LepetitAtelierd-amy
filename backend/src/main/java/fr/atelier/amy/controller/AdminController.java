package fr.atelier.amy.controller;

import fr.atelier.amy.dto.Requests;
import fr.atelier.amy.model.*;
import fr.atelier.amy.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final ProductRepository products;
    private final CategoryRepository categories;
    private final OrderRepository orders;

    public AdminController(ProductRepository p, CategoryRepository c, OrderRepository o) {
        products = p;
        categories = c;
        orders = o;
    }

    @GetMapping("/orders")
    List<CustomerOrder> orders() {
        return orders.findAllByOrderByIdDesc();
    }

    @GetMapping("/summary")
    Map<String, Object> summary() {
        var all = orders.findAll();
        long revenue = all.stream().filter(o -> o.paymentStatus.equals("PAID")).mapToLong(o -> o.totalCents).sum();
        return Map.of("revenueCents", revenue, "orders", all.size(), "pending",
                all.stream().filter(o -> o.status.equals("PENDING")).count(), "inProgress",
                all.stream().filter(o -> o.status.equals("MAKING")).count(), "delivered",
                all.stream().filter(o -> o.status.equals("DELIVERED")).count());
    }

    @PatchMapping("/orders/{id}/status")
    CustomerOrder status(@PathVariable Long id, @Valid @RequestBody Requests.Status data) {
        if (!Set.of("PENDING", "ACCEPTED", "MAKING", "READY", "DELIVERED", "CANCELLED").contains(data.status()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        CustomerOrder order = orders.findById(id).orElseThrow();
        order.status = data.status();
        return orders.save(order);
    }

    @PatchMapping("/orders/{id}/payment")
    CustomerOrder payment(@PathVariable Long id, @Valid @RequestBody Requests.Payment data) {
        if (!Set.of("UNPAID", "PAID", "REFUNDED").contains(data.paymentStatus()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        CustomerOrder order = orders.findById(id).orElseThrow();
        order.paymentStatus = data.paymentStatus();
        return orders.save(order);
    }

    @PostMapping("/categories")
    Category createCategory(@RequestBody Map<String, String> request) {
        String slug = request.getOrDefault("slug", "").trim().toLowerCase(Locale.ROOT);
        String name = request.getOrDefault("name", "").trim();
        if (!slug.matches("[a-z0-9-]{2,60}") || name.isBlank() || name.length() > 90)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Catégorie invalide");
        Category c = new Category();
        c.name = name;
        c.slug = slug;
        return categories.save(c);
    }

    @PostMapping("/products/{id}/options")
    Product addOption(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Product p = products.findById(id).orElseThrow();
        String kind = String.valueOf(request.getOrDefault("kind", "")).trim();
        String label = String.valueOf(request.getOrDefault("label", "")).trim();
        if (kind.isBlank() || kind.length() > 40 || label.isBlank() || label.length() > 100)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Option invalide");
        long extra;
        try {
            extra = Long.parseLong(String.valueOf(request.getOrDefault("extraCents", 0)));
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prix invalide");
        }
        if (extra < 0 || extra > 1000000)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prix invalide");
        ProductOption option = new ProductOption();
        option.product = p;
        option.kind = kind;
        option.label = label;
        option.extraCents = extra;
        Object imageValue = request.get("imagePath");
        if (imageValue != null) {
            String imagePath = String.valueOf(imageValue).trim();
            if (!imagePath.isEmpty() && (!imagePath.startsWith("/assets/images/") || imagePath.contains("..")
                    || imagePath.length() > 255))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chemin image invalide");
            option.imagePath = imagePath.isEmpty() ? null : imagePath;
        }
        p.options.add(option);
        return products.save(p);
    }

    @PostMapping("/products")
    Product create(@Valid @RequestBody Requests.ProductEdit r) {
        Product p = new Product();
        return products.save(updateFields(p, r));
    }

    @PutMapping("/products/{id}")
    Product update(@PathVariable Long id, @Valid @RequestBody Requests.ProductEdit r) {
        return products.save(updateFields(products.findById(id).orElseThrow(), r));
    }

    private Product updateFields(Product p, Requests.ProductEdit r) {
        p.category = categories.findById(r.categoryId()).orElseThrow();
        p.name = r.name();
        p.description = r.description() == null ? "" : r.description();
        p.imagePath = r.imagePath();
        p.priceCents = r.priceCents();
        p.active = r.active();
        return p;
    }
}
