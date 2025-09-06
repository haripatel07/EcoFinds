import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/product.dart';

class CartItem {
  final String productId;
  final String title;
  final double price;
  final String imagePath;
  int quantity;
  final String sellerId;

  CartItem({
    required this.productId,
    required this.title,
    required this.price,
    required this.imagePath,
    this.quantity = 1,
    required this.sellerId,
  });

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'title': title,
      'price': price,
      'imagePath': imagePath,
      'quantity': quantity,
      'sellerId': sellerId,
    };
  }

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      productId: json['productId'],
      title: json['title'],
      price: json['price'].toDouble(),
      imagePath: json['imagePath'],
      quantity: json['quantity'],
      sellerId: json['sellerId'],
    );
  }

  factory CartItem.fromProduct(Product product, {int quantity = 1}) {
    return CartItem(
      productId: product.id,
      title: product.title,
      price: product.price,
      imagePath: product.imageUrls.isNotEmpty ? product.imageUrls.first : '',
      quantity: quantity,
      sellerId: product.sellerId,
    );
  }
}

class CartStorage {
  static const String _cartKey = 'shopping_cart';

  // Get all cart items
  static Future<List<CartItem>> getCartItems() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartJson = prefs.getString(_cartKey);
      
      if (cartJson == null) {
        return [];
      }

      final List<dynamic> cartList = json.decode(cartJson);
      return cartList.map((itemJson) => CartItem.fromJson(itemJson)).toList();
    } catch (e) {
      print('Error loading cart items: $e');
      return [];
    }
  }

  // Add item to cart
  static Future<bool> addToCart(CartItem item) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartItems = await getCartItems();
      
      // Check if item already exists in cart
      final existingItemIndex = cartItems.indexWhere(
        (cartItem) => cartItem.productId == item.productId,
      );
      
      if (existingItemIndex != -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += item.quantity;
      } else {
        // Add new item
        cartItems.add(item);
      }
      
      final cartJson = json.encode(cartItems.map((item) => item.toJson()).toList());
      await prefs.setString(_cartKey, cartJson);
      
      return true;
    } catch (e) {
      print('Error adding to cart: $e');
      return false;
    }
  }

  // Remove item from cart
  static Future<bool> removeFromCart(String productId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartItems = await getCartItems();
      
      cartItems.removeWhere((item) => item.productId == productId);
      
      final cartJson = json.encode(cartItems.map((item) => item.toJson()).toList());
      await prefs.setString(_cartKey, cartJson);
      
      return true;
    } catch (e) {
      print('Error removing from cart: $e');
      return false;
    }
  }

  // Update item quantity
  static Future<bool> updateItemQuantity(String productId, int newQuantity) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cartItems = await getCartItems();
      
      final itemIndex = cartItems.indexWhere((item) => item.productId == productId);
      if (itemIndex != -1) {
        if (newQuantity <= 0) {
          cartItems.removeAt(itemIndex);
        } else {
          cartItems[itemIndex].quantity = newQuantity;
        }
        
        final cartJson = json.encode(cartItems.map((item) => item.toJson()).toList());
        await prefs.setString(_cartKey, cartJson);
        return true;
      }
      
      return false;
    } catch (e) {
      print('Error updating cart item: $e');
      return false;
    }
  }

  // Get total items count in cart
  static Future<int> getCartItemsCount() async {
    final cartItems = await getCartItems();
    int total = 0;
    for (var item in cartItems) {
      total += item.quantity;
    }
    return total;
  }

  // Get total cart value
  static Future<double> getCartTotal() async {
    final cartItems = await getCartItems();
    double total = 0.0;
    for (var item in cartItems) {
      total += (item.price * item.quantity);
    }
    return total;
  }

  // Clear cart
  static Future<bool> clearCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_cartKey);
      return true;
    } catch (e) {
      print('Error clearing cart: $e');
      return false;
    }
  }

  // Check if product is in cart
  static Future<bool> isInCart(String productId) async {
    final cartItems = await getCartItems();
    return cartItems.any((item) => item.productId == productId);
  }

  // Get quantity of specific product in cart
  static Future<int> getProductQuantityInCart(String productId) async {
    final cartItems = await getCartItems();
    try {
      final item = cartItems.firstWhere((item) => item.productId == productId);
      return item.quantity;
    } catch (e) {
      return 0;
    }
  }
}
