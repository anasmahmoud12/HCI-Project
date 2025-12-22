package e_commerce.e_commerce.ProductsAndCategories.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Column(name = "payment_id", unique = true)
    private String paymentId; // PayPal Payment ID

    @Column(name = "payer_id")
    private String payerId; // PayPal Payer ID

    private Double amount;

    @Column(name = "currency", length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "payment_method")
    private String paymentMethod; // "PAYPAL", "CARD", etc.

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "transaction_data", columnDefinition = "TEXT")
    private String transactionData; // Store PayPal response JSON

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}