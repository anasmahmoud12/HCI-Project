package e_commerce.e_commerce.ProductsAndCategories.serviec;

import e_commerce.e_commerce.ProductsAndCategories.DTO.OrderDto;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderItemEntity;
import e_commerce.e_commerce.ProductsAndCategories.Entities.ProductEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.OrderRepository;

import e_commerce.e_commerce.ProductsAndCategories.Repositories.ProductRepository;
import e_commerce.e_commerce.utils.Entities.Address;
import e_commerce.e_commerce.utils.Entities.User;
import e_commerce.e_commerce.utils.Repasitories.AddressRepository;
import e_commerce.e_commerce.utils.Repasitories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository ;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    @Transactional //if anything fails return back so good!
    public OrderEntity createOrder(Long userId, OrderDto request) {

        //1. validate the existence of the uer maybe

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not there"));

        //2. validate the address
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("address not there"));

        //3. create the object of the order
        OrderEntity order = OrderEntity.builder()
                .user(user)
                .shippingAddress(address)
                .paymentMethod(request.getPaymentMethod())
                .status("PENDING!")
                .orderItems(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .orderNumber((UUID.randomUUID().toString()))
                .build();

        BigDecimal calculatedTotal = BigDecimal.ZERO;

        for (OrderDto.OrderItemRequest itemRequest : request.getItems()){

            //GET THE PRODUCT FROM THE DATABASE
            ProductEntity product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("product not there: " + itemRequest.getProductId()));

            //check the stock "we can remove that i think"
            if(product.getQuantity() < itemRequest.getQuantity()){
                throw new RuntimeException("product quantity less than item quantity sorry.");

            }
            //create the orderitem entity
            OrderItemEntity orderItemEntity = OrderItemEntity.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(BigDecimal.valueOf(product.getPrice()))//get price from database
                    .order(order)
                    .build();

            BigDecimal itemTotal = BigDecimal.valueOf(product.getPrice()).multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            calculatedTotal = calculatedTotal.add(itemTotal);

            order.getOrderItems().add(orderItemEntity);



        }
        //get final price
        order.setTotalPrice(calculatedTotal);

        //save to the database
        return orderRepository.save(order);


    }
}
