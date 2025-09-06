import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/product.dart';

class ProductStorage {
  static const String _productsKey = 'products';

  // Get all products
  static Future<List<Product>> getAllProducts() async {
    final prefs = await SharedPreferences.getInstance();
    final productsJson = prefs.getString(_productsKey);
    
    if (productsJson == null) {
      return [];
    }

    try {
      final List<dynamic> productsList = json.decode(productsJson);
      return productsList.map((productJson) => Product.fromJson(productJson)).toList();
    } catch (e) {
      print('Error loading products: $e');
      return [];
    }
  }

  // Get products by seller ID
  static Future<List<Product>> getProductsBySeller(String sellerId) async {
    final allProducts = await getAllProducts();
    return allProducts.where((product) => product.sellerId == sellerId).toList();
  }

  // Add a new product
  static Future<bool> addProduct(Product product) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final products = await getAllProducts();
      
      products.add(product);
      
      final productsJson = json.encode(products.map((p) => p.toJson()).toList());
      await prefs.setString(_productsKey, productsJson);
      
      return true;
    } catch (e) {
      print('Error adding product: $e');
      return false;
    }
  }

  // Update a product
  static Future<bool> updateProduct(Product updatedProduct) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final products = await getAllProducts();
      
      final index = products.indexWhere((p) => p.id == updatedProduct.id);
      if (index == -1) {
        return false; // Product not found
      }
      
      products[index] = updatedProduct;
      
      final productsJson = json.encode(products.map((p) => p.toJson()).toList());
      await prefs.setString(_productsKey, productsJson);
      
      return true;
    } catch (e) {
      print('Error updating product: $e');
      return false;
    }
  }

  // Delete a product
  static Future<bool> deleteProduct(String productId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final products = await getAllProducts();
      
      final index = products.indexWhere((p) => p.id == productId);
      if (index == -1) {
        return false; // Product not found
      }
      
      products.removeAt(index);
      
      final productsJson = json.encode(products.map((p) => p.toJson()).toList());
      await prefs.setString(_productsKey, productsJson);
      
      return true;
    } catch (e) {
      print('Error deleting product: $e');
      return false;
    }
  }

  // Get a single product by ID
  static Future<Product?> getProduct(String productId) async {
    final products = await getAllProducts();
    try {
      return products.firstWhere((p) => p.id == productId);
    } catch (e) {
      return null;
    }
  }

  // Search products
  static Future<List<Product>> searchProducts(String query) async {
    final products = await getAllProducts();
    final lowercaseQuery = query.toLowerCase();
    
    return products.where((product) {
      return product.title.toLowerCase().contains(lowercaseQuery) ||
             product.description.toLowerCase().contains(lowercaseQuery) ||
             product.category.toLowerCase().contains(lowercaseQuery) ||
             (product.brand?.toLowerCase().contains(lowercaseQuery) ?? false);
    }).toList();
  }

  // Get products by category
  static Future<List<Product>> getProductsByCategory(String category) async {
    final products = await getAllProducts();
    return products.where((product) => product.category == category).toList();
  }

  // Clear all products (for testing)
  static Future<void> clearAllProducts() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_productsKey);
  }
}
