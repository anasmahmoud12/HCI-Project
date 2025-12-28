package e_commerce.e_commerce.ProductsAndCategories.controller;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import e_commerce.e_commerce.ProductsAndCategories.Entities.OrderEntity;
import e_commerce.e_commerce.ProductsAndCategories.Repositories.OrderRepository;
import e_commerce.e_commerce.ProductsAndCategories.serviec.OrderService;
import e_commerce.e_commerce.ProductsAndCategories.serviec.PaypalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*") // Configure for your Angular app
@RequiredArgsConstructor
public class PayPalController {

    private final PaypalService payPalService;
    private final OrderService orderService;
private  final  OrderRepository orderRepository;
    private static final String SUCCESS_URL = "http://localhost:8080/api/payments/success";
    private static final String CANCEL_URL = "http://localhost:8080/api/payments/cancel";

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestParam Long orderId,
                                           @RequestParam(required = false) Long userId) {
        try {
            // Get order from database
            OrderEntity order;
            System.out.println(userId);
            System.out.println(orderId);
            if (userId != null) {
                order = orderService.getOrderById(orderId, userId);
                System.out.println(orderId);
            } else {
                order = orderService.getOrderById(orderId);
            }
             order.setPaymentMethod("PAYPAL");
            order.setStatus("PENDING_PAYMENT");
            orderRepository.save(order);
            // Check if order is eligible for payment
            if (!"PENDING_PAYMENT".equals(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Order is not in a payable state. Status: " + order.getStatus()));
            }

            // Check if payment method is PayPal
            if (!"PAYPAL".equalsIgnoreCase(order.getPaymentMethod())) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Order payment method is not PayPal. Method: " + order.getPaymentMethod()));
            }

            System.out.println("Creating PayPal payment for Order: " + order.getOrderNumber() +
                    ", Amount: $" + order.getTotalPrice());

            // Create PayPal payment
            Payment payment = payPalService.createPayment(
                    order.getTotalPrice(),
                    "USD",
                    "paypal",
                    "sale",
                    "Payment for Order #" + order.getOrderNumber(),
                    CANCEL_URL + "?orderId=" + orderId + (userId != null ? "&userId=" + userId : ""),
                    SUCCESS_URL + "?orderId=" + orderId + (userId != null ? "&userId=" + userId : ""));

            // Find approval URL
            for (Links link : payment.getLinks()) {
                if ("approval_url".equals(link.getRel())) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("paymentId", payment.getId());
                    response.put("approvalUrl", link.getHref());
                    response.put("orderId", orderId);
                    response.put("orderNumber", order.getOrderNumber());
                    response.put("amount", order.getTotalPrice());

                    System.out.println("Payment created. Redirect URL: " + link.getHref());
                    return ResponseEntity.ok(response);
                }
            }

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Could not create PayPal payment"));

        } catch (PayPalRESTException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "PayPal payment creation failed: " + e.getMessage()));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/success")
    public String paymentSuccess(
            @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId,
            @RequestParam("orderId") Long orderId,
            @RequestParam(value = "userId", required = false) Long userId) {

        System.out.println("Payment Success - PaymentID: " + paymentId +
                ", PayerID: " + payerId +
                ", OrderID: " + orderId);

        try {
            // Execute PayPal payment
            Payment payment = payPalService.execute(paymentId, payerId);

            if ("approved".equals(payment.getState())) {
                // Update order status in database
                orderService.updateOrderPaymentStatus(orderId, paymentId, payerId, true);

                // Return success HTML page
                return createSuccessHtml(orderId, paymentId, userId);
            } else {
                orderService.updateOrderPaymentStatus(orderId, paymentId, payerId, false);
                return createErrorHtml("Payment was not approved by PayPal", orderId, userId);
            }

        } catch (PayPalRESTException e) {
            e.printStackTrace();
            orderService.updateOrderPaymentStatus(orderId, paymentId, payerId, false);
            return createErrorHtml("Payment execution failed: " + e.getMessage(), orderId, userId);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return createErrorHtml(e.getMessage(), orderId, userId);
        }
    }
@Transactional
    @GetMapping("/cancel")
    public String paymentCancel(
            @RequestParam("orderId") Long orderId,
            @RequestParam(value = "userId", required = false) Long userId) {

        System.out.println("Payment cancelled for Order ID: " + orderId);

        try {
            // Update order status to cancelled
            OrderEntity order = orderService.getOrderById(orderId);
            order.setPaymentStatus("CANCELLED");
            System.out.println("llll");
            System.out.println("qqqq");
            // Restore stock

            orderRepository.save(order);

            return createCancelHtml(orderId, userId);

        } catch (RuntimeException e) {
            e.printStackTrace();
            return createErrorHtml("Failed to cancel order: " + e.getMessage(), orderId, userId);
        }
    }

    private String createSuccessHtml(Long orderId, String paymentId, Long userId) {
        String redirectUrl = userId != null
                ? "http://localhost:4200/orders/" + orderId + "?userId=" + userId
                : "http://localhost:4200/orders/" + orderId;

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<title>Payment Successful</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
                ".success-icon { color: #4CAF50; font-size: 48px; margin-bottom: 20px; }" +
                ".button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 10px; }" +
                ".button:hover { background-color: #45a049; }" +
                ".info { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='success-icon'>✓</div>" +
                "<h1>Payment Successful!</h1>" +
                "<div class='info'>" +
                "<p><strong>Order ID:</strong> " + orderId + "</p>" +
                "<p><strong>Payment ID:</strong> " + paymentId + "</p>" +
                "<p>Your payment has been processed successfully. You will receive an email confirmation shortly.</p>" +
                "</div>" +
                "<div>" +
                "<a href='" + redirectUrl + "' class='button'>View Order Details</a>" +
                "<a href='http://localhost:4200' class='button' style='background-color: #007bff;'>Continue Shopping</a>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    // Add to PayPalController.java
    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long orderId,
                                              @RequestParam(required = false) Long userId) {
        try {
            OrderEntity order;
            if (userId != null) {
                order = orderService.getOrderById(orderId, userId);
            } else {
                order = orderService.getOrderById(orderId);
            }

            return ResponseEntity.ok(Map.of(
                    "paymentStatus", order.getPaymentStatus(),
                    "orderStatus", order.getStatus(),
                    "orderId", orderId
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/payment-details/{orderId}")
    public ResponseEntity<?> getPaymentDetails(@PathVariable Long orderId,
                                               @RequestParam(required = false) Long userId) {
        try {
            OrderEntity order;
            if (userId != null) {
                order = orderService.getOrderById(orderId, userId);
            } else {
                order = orderService.getOrderById(orderId);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("orderNumber", order.getOrderNumber());
            response.put("paymentStatus", order.getPaymentStatus());
            response.put("orderStatus", order.getStatus());
            response.put("totalAmount", order.getTotalPrice());
            response.put("paymentMethod", order.getPaymentMethod());

            // Add more details if payment is completed

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    private String createCancelHtml(Long orderId, Long userId) {
        String redirectUrl = userId != null
                ? "http://localhost:4200/checkout?orderId=" + orderId + "&userId=" + userId
                : "http://localhost:4200/checkout?orderId=" + orderId;

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<title>Payment Cancelled</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
                ".cancel-icon { color: #ff9800; font-size: 48px; margin-bottom: 20px; }" +
                ".button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 10px; }" +
                ".button:hover { background-color: #0056b3; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='cancel-icon'>⚠</div>" +
                "<h1>Payment Cancelled</h1>" +
                "<p>Your payment was cancelled. No amount has been charged.</p>" +
                "<p>You can try again or choose a different payment method.</p>" +
                "<div>" +
                "<a href='" + redirectUrl + "' class='button'>Try Again</a>" +
                "<a href='http://localhost:4200/cart' class='button' style='background-color: #6c757d;'>Back to Cart</a>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    private String createErrorHtml(String errorMessage, Long orderId, Long userId) {
        String redirectUrl = userId != null
                ? "http://localhost:4200/checkout?orderId=" + orderId + "&userId=" + userId
                : "http://localhost:4200/checkout?orderId=" + orderId;

        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<title>Payment Error</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }" +
                ".container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
                ".error-icon { color: #dc3545; font-size: 48px; margin-bottom: 20px; }" +
                ".error-message { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; margin: 20px 0; }" +
                ".button { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; margin: 10px; }" +
                ".button:hover { background-color: #c82333; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='error-icon'>✗</div>" +
                "<h1>Payment Error</h1>" +
                "<div class='error-message'>" + errorMessage + "</div>" +
                "<p>Please try again or contact support if the problem persists.</p>" +
                "<div>" +
                "<a href='" + redirectUrl + "' class='button'>Try Again</a>" +
                "<a href='http://localhost:4200/support' class='button' style='background-color: #6c757d;'>Contact Support</a>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}