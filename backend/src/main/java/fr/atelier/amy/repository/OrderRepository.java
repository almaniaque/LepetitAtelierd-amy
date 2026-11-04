package fr.atelier.amy.repository;

import fr.atelier.amy.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByUserIdOrderByIdDesc(Long userId);

    List<CustomerOrder> findAllByOrderByIdDesc();
}
