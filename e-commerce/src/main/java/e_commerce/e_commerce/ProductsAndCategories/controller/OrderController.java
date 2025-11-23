package e_commerce.e_commerce.ProductsAndCategories.controller;


import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.OrderRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    //http://localhost:8080/api/orders/5

    @PostMapping("/{userId}")
    public ResponseEntity<OrderEntity> placeOrder(
            @PathVariable Long userId,
            @RequestBody OrderDto orderRequest
    ){
        OrderEntity newOrder = orderService.createOrder(userId,orderRequest);

        return ResponseEntity.ok(newOrder);
    }
}
