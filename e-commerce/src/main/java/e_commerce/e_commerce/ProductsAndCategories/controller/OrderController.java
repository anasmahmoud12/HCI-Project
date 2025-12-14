package e_commerce.e_commerce.ProductsAndCategories.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.serviec.OrderService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

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
   

// @GetMapping("/user/{userId}")
// public ResponseEntity<List<OrderEntity>> getUserOrders(@PathVariable Long userId){

// }

// @GetMapping("/{orderId}")
// public ResponseEntity<OrderEntity> getOrderById(@PathVariable Long orderId){
    
// }







}
