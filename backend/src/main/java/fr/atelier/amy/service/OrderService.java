package fr.atelier.amy.service;

import fr.atelier.amy.dto.Requests;
import fr.atelier.amy.model.*;
import fr.atelier.amy.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.*;

@Service
public class OrderService {
    private final ProductRepository products;
    private final UserRepository users;
    private final OrderRepository orders;

    public OrderService(ProductRepository p, UserRepository u, OrderRepository o) {
        products = p;
        users = u;
        orders = o;
    }

    @Transactional
    public CustomerOrder checkout(String email, Requests.Checkout data) {
        if (!data.acceptsCgv())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CGV non acceptées");
        if (data.lines().size() > 40)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trop de lignes");
        CustomerOrder order = new CustomerOrder();
        order.user = users.findByEmailIgnoreCase(email).orElseThrow();
        order.customerNote = data.note();
        long sum = 0;
        for (var line : data.lines()) {
            Product product = products.findById(line.productId()).filter(p -> p.active)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produit indisponible"));
            long price = product.priceCents;
            List<String> optionLabels = new ArrayList<>();
            Set<String> kinds = new HashSet<>();
            Set<Long> seen = new HashSet<>();
            for (Long optId : line.optionIds() == null ? List.<Long>of() : line.optionIds()) {
                if (!seen.add(optId))
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Option dupliquée");
                ProductOption option = product.options.stream().filter(x -> x.id.equals(optId)).findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Option invalide"));
                if (!kinds.add(option.kind))
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Option incompatible");
                price = Math.addExact(price, option.extraCents);
                optionLabels.add(option.kind + ": " + option.label);
            }
            OrderLine l = new OrderLine();
            l.order = order;
            l.productName = product.name;
            l.quantity = line.quantity();
            l.unitPriceCents = price;
            l.optionsSnapshot = String.join(" · ", optionLabels);
            order.lines.add(l);
            sum = Math.addExact(sum, Math.multiplyExact(price, line.quantity()));
        }
        order.totalCents = sum;
        return orders.save(order);
    }
}
