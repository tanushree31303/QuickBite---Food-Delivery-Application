package in.tanu.quickbite.service;

import in.tanu.quickbite.io.CartRequest;
import in.tanu.quickbite.io.CartResponse;

public interface CartService {
   CartResponse addToCart(CartRequest request);
   CartResponse getCart();
   void clearCart();
   CartResponse removeFromCart(CartRequest cartRequest);
}
