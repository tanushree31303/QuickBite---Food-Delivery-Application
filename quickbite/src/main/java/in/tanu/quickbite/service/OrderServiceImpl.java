package in.tanu.quickbite.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import in.tanu.quickbite.entity.OrderEntity;
import in.tanu.quickbite.io.OrderRequest;
import in.tanu.quickbite.io.OrderResponse;
import in.tanu.quickbite.repository.CartRepository;
import in.tanu.quickbite.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service

public class OrderServiceImpl implements OrderService{


    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private  UserService userService;

    @Autowired
    private CartRepository cartRepository;

    @Value("${razorpay_key}")
    private String RAZORPAY_KEY;

    @Value("${razorpay_secret}")
    private String RAZORPAY_SECRET;


    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException {
        OrderEntity newOrder = convertToEntity(request);
        newOrder = orderRepository.save(newOrder);

        //create razor pay payment order
        RazorpayClient razorpayClient = new RazorpayClient(RAZORPAY_KEY,RAZORPAY_SECRET);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount",newOrder.getAmount());
        orderRequest.put("currency","INR");
        orderRequest.put("payment_capture",1);

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        newOrder.setRazorpayOrderId(razorpayOrder.get("id"));
        String loggedInUserId = userService.findByUserId();
        newOrder.setUserId(loggedInUserId);
        newOrder  = orderRepository.save(newOrder);
        return convertToResponse(newOrder);

    }

    @Override
    public void verifyPayment(Map<String, String> paymentData, String status) {
        String razorpay_order_id = paymentData.get("razorpay_order_id");
       OrderEntity existingOrder =  orderRepository.findByRazorpayOrderId(razorpay_order_id)
                .orElseThrow(()->new RuntimeException("Order not found"));
       existingOrder.setPaymentStatus(status);
       existingOrder.setRazorpaySignature(paymentData.get("razorpay_signature"));
        existingOrder.setRazorpayPaymentId(paymentData.get("razorpay_payment_id"));
        orderRepository.save(existingOrder);
        if("paid".equalsIgnoreCase(status)){
            cartRepository.deleteByUserId(existingOrder.getUserId());
        }
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);

        return list.stream()
                .map(entity -> convertToResponse(entity))
                .collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
         orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
       List<OrderEntity> list =  orderRepository.findAll();
       return list.stream().map(entity->convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity orderEntity = orderRepository.findById(orderId)
                .orElseThrow(()->new RuntimeException("Order not found"));
        orderEntity.setOrderStatus(status);
        orderRepository.save(orderEntity);
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .id(newOrder.getId())
                .amount(newOrder.getAmount())
                .userAddress(newOrder.getUserAddress())
                .userId(newOrder.getUserId())
                .razorpayOrderId(newOrder.getRazorpayOrderId())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .orderedItems(newOrder.getOrderedItems())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
      return   OrderEntity.builder()
                .userAddress((request.getUserAddress()))
                .amount(request.getAmount())
                .orderedItems(request.getOrderedItems())
              .email(request.getEmail())
              .phoneNumber(request.getPhoneNumber())
              .orderStatus(request.getOrderStatus())
                .build();
    }
}
