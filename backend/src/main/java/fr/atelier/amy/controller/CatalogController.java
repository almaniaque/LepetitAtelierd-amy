package fr.atelier.amy.controller;

import fr.atelier.amy.model.*;
import fr.atelier.amy.repository.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class CatalogController {
    private final ProductRepository products;
    private final CategoryRepository categories;

    public CatalogController(ProductRepository p, CategoryRepository c) {
        products = p;
        categories = c;
    }

    @GetMapping("/products")
    List<Product> products() {
        return products.findByActiveTrueOrderByIdAsc();
    }

    @GetMapping("/categories")
    List<Category> categories() {
        return categories.findAll();
    }
}
