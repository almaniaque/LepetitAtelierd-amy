package fr.atelier.amy.controller;

import fr.atelier.amy.dto.Requests;
import fr.atelier.amy.repository.*;
import fr.atelier.amy.service.OrderService;
import fr.atelier.amy.model.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orders;
    private final UserRepository users;
    private final OrderService service;

    public OrderController(OrderRepository o, UserRepository u, OrderService s) {
        orders = o;
        users = u;
        service = s;
    }

    @PostMapping
    CustomerOrder create(@Valid @RequestBody Requests.Checkout request, Principal principal) {
        return service.checkout(principal.getName(), request);
    }

    @GetMapping
    List<CustomerOrder> mine(Principal principal) {
        return orders.findByUserIdOrderByIdDesc(users.findByEmailIgnoreCase(principal.getName()).orElseThrow().id);
    }
}
