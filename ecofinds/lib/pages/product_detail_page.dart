import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/cart_storage.dart';
import '../widgets/product_image_widget.dart';
import '../widgets/app_drawer.dart';
import 'cart_page.dart';

class ProductDetailPage extends StatefulWidget {
  final Product product;
  final bool isOwner;

  const ProductDetailPage({
    super.key,
    required this.product,
    this.isOwner = false,
  });

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  late Product _product;
  int _currentImageIndex = 0;

  @override
  void initState() {
    super.initState();
    _product = widget.product;
  }

  void _addToCart() async {
    if (widget.isOwner) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You cannot buy your own product!')),
      );
      return;
    }

    final cartItem = CartItem.fromProduct(_product);
    final success = await CartStorage.addToCart(cartItem);
    
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${_product.title} added to cart!'),
          backgroundColor: Colors.green,
          action: SnackBarAction(
            label: 'View Cart',
            textColor: Colors.white,
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const CartPage()),
              );
            },
          ),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to add to cart'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      drawer: const AppDrawer(),
      appBar: AppBar(
        backgroundColor: Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Container(
          height: 30,
          child: Image.asset(
            'assets/ecofinds_logo.png',
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.shopping_cart, color: Colors.white, size: 20),
                  SizedBox(width: 5),
                  Text('Logo', style: TextStyle(color: Colors.white, fontSize: 16)),
                ],
              );
            },
          ),
        ),
        centerTitle: true,
        actions: [
          const Icon(Icons.person, color: Colors.white),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product Page title
              const Text(
                'Product Page',
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),

              // Product Image Section with Enhanced Navigation
              Container(
                height: 350,
                width: double.infinity,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white),
                  borderRadius: BorderRadius.circular(8),
                  color: Colors.grey[900],
                ),
                child: _product.imageUrls.isNotEmpty
                    ? Stack(
                        children: [
                          // Main Image with PageView
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: PageView.builder(
                              itemCount: _product.imageUrls.length,
                              onPageChanged: (index) {
                                setState(() {
                                  _currentImageIndex = index;
                                });
                              },
                              itemBuilder: (context, index) {
                                return ProductImageWidget(
                                  imagePath: _product.imageUrls[index],
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                );
                              },
                            ),
                          ),
                          
                          // Navigation arrows (only show if more than 1 image)
                          if (_product.imageUrls.length > 1) ...[
                            // Left arrow
                            Positioned(
                              left: 16,
                              top: 0,
                              bottom: 0,
                              child: Center(
                                child: GestureDetector(
                                  onTap: () {
                                    if (_currentImageIndex > 0) {
                                      setState(() {
                                        _currentImageIndex--;
                                      });
                                    }
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.5),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(
                                      Icons.arrow_back_ios,
                                      color: _currentImageIndex > 0 ? Colors.white : Colors.grey,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            
                            // Right arrow
                            Positioned(
                              right: 16,
                              top: 0,
                              bottom: 0,
                              child: Center(
                                child: GestureDetector(
                                  onTap: () {
                                    if (_currentImageIndex < _product.imageUrls.length - 1) {
                                      setState(() {
                                        _currentImageIndex++;
                                      });
                                    }
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.5),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(
                                      Icons.arrow_forward_ios,
                                      color: _currentImageIndex < _product.imageUrls.length - 1 
                                          ? Colors.white : Colors.grey,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                          
                          // Image counter
                          if (_product.imageUrls.length > 1)
                            Positioned(
                              top: 16,
                              right: 16,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.7),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Text(
                                  '${_currentImageIndex + 1}/${_product.imageUrls.length}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          
                          // Image indicators (dots)
                          if (_product.imageUrls.length > 1)
                            Positioned(
                              bottom: 16,
                              left: 0,
                              right: 0,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: _product.imageUrls.asMap().entries.map((entry) {
                                  return GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        _currentImageIndex = entry.key;
                                      });
                                    },
                                    child: Container(
                                      width: _currentImageIndex == entry.key ? 12.0 : 8.0,
                                      height: _currentImageIndex == entry.key ? 12.0 : 8.0,
                                      margin: const EdgeInsets.symmetric(horizontal: 4.0),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: _currentImageIndex == entry.key
                                            ? Colors.white
                                            : Colors.white.withOpacity(0.4),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                        ],
                      )
                    : Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          color: Colors.grey[800],
                        ),
                        child: const Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.image_not_supported, 
                                   color: Colors.white, size: 48),
                              SizedBox(height: 8),
                              Text('No Images Available', 
                                   style: TextStyle(color: Colors.white)),
                            ],
                          ),
                        ),
                      ),
              ),
              const SizedBox(height: 20),

              // Product Description Section - Enhanced Layout
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Product Title and Price Header
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            _product.title,
                            style: const TextStyle(
                              color: Colors.white, 
                              fontSize: 24, 
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: Colors.green,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '\$${_product.price.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    
                    // Category and Condition Row
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.blue.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.blue),
                          ),
                          child: Text(
                            _product.category,
                            style: const TextStyle(color: Colors.blue, fontSize: 12),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.orange.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.orange),
                          ),
                          child: Text(
                            _product.condition,
                            style: const TextStyle(color: Colors.orange, fontSize: 12),
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Qty: ${_product.quantity}',
                          style: TextStyle(color: Colors.grey[400], fontSize: 14),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    
                    // Product Description Header
                    const Text(
                      'Product Description',
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    
                    // Main Description
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey[900],
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[700]!),
                      ),
                      child: Text(
                        _product.description,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    
                    // Product Details Grid
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey[900],
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[700]!),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Product Details',
                            style: TextStyle(
                              color: Colors.white, 
                              fontSize: 16, 
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          
                          // Details in a more organized way
                          if (_product.brand != null) _buildDetailRow('Brand', _product.brand!),
                          if (_product.model != null) _buildDetailRow('Model', _product.model!),
                          if (_product.yearOfManufacture != null) 
                            _buildDetailRow('Year of Manufacture', _product.yearOfManufacture!),
                          if (_product.dimensions != null) _buildDetailRow('Dimensions', _product.dimensions!),
                          if (_product.weight != null) _buildDetailRow('Weight', _product.weight!),
                          if (_product.material != null) _buildDetailRow('Material', _product.material!),
                          if (_product.color != null) _buildDetailRow('Color', _product.color!),
                          
                          // Special features
                          if (_product.isEcoFriendly || _product.hasManualIncluded) ...[
                            const SizedBox(height: 12),
                            const Text(
                              'Features',
                              style: TextStyle(
                                color: Colors.white, 
                                fontSize: 14, 
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            if (_product.isEcoFriendly)
                              _buildFeatureRow(Icons.eco, 'Eco-Friendly Packaging'),
                            if (_product.hasManualIncluded)
                              _buildFeatureRow(Icons.book, 'Manual/Instructions Included'),
                          ],
                          
                          if (_product.workingConditionDescription != null) ...[
                            const SizedBox(height: 16),
                            const Text(
                              'Working Condition',
                              style: TextStyle(
                                color: Colors.white, 
                                fontSize: 14, 
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _product.workingConditionDescription!,
                              style: const TextStyle(color: Colors.white),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),

              // Action Buttons Section - Always show Add to Cart
              Container(
                width: double.infinity,
                margin: const EdgeInsets.symmetric(vertical: 20),
                child: Column(
                  children: [
                    // Add to Cart Button - Enhanced (show for all users)
                    Container(
                      width: double.infinity,
                      height: 60,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: widget.isOwner 
                              ? [Colors.grey.shade600, Colors.grey.shade400]
                              : [Colors.green.shade600, Colors.green.shade400],
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                        ),
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [
                          BoxShadow(
                            color: (widget.isOwner ? Colors.grey : Colors.green).withOpacity(0.4),
                            spreadRadius: 2,
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: ElevatedButton.icon(
                        onPressed: widget.isOwner ? null : _addToCart,
                        icon: const Icon(Icons.shopping_cart_outlined, size: 28, color: Colors.white),
                        label: Text(
                          widget.isOwner ? 'Your Product' : '🛒 Add to Cart',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                            color: Colors.white,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(vertical: 15),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                          elevation: 0,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Product Info Summary
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey[900]?.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[700]!),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Total Price',
                                style: TextStyle(
                                  color: Colors.grey[400],
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                '\$${_product.price.toStringAsFixed(2)}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                'Available',
                                style: TextStyle(
                                  color: Colors.grey[400],
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                '${_product.quantity} units',
                                style: TextStyle(
                                  color: _product.quantity > 0 ? Colors.green : Colors.red,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[400], 
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: Colors.white, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(IconData icon, String feature) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Icon(icon, color: Colors.green, size: 16),
          const SizedBox(width: 8),
          Text(
            feature,
            style: const TextStyle(color: Colors.green, fontSize: 14),
          ),
        ],
      ),
    );
  }
}
