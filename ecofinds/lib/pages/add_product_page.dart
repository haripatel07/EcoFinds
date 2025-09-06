import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import '../models/product.dart';
import '../services/product_storage.dart';
import '../services/web_image_storage.dart';
import '../widgets/app_drawer.dart';

class AddProductPage extends StatefulWidget {
  final String sellerId;

  const AddProductPage({super.key, required this.sellerId});

  @override
  State<AddProductPage> createState() => _AddProductPageState();
}

class _AddProductPageState extends State<AddProductPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _quantityController = TextEditingController();
  final _yearController = TextEditingController();
  final _brandController = TextEditingController();
  final _modelController = TextEditingController();
  final _dimensionsController = TextEditingController();
  final _weightController = TextEditingController();
  final _materialController = TextEditingController();
  final _colorController = TextEditingController();
  final _workingConditionController = TextEditingController();

  String _selectedCategory = 'Home';
  String _selectedCondition = 'New';
  bool _isEcoFriendly = false;
  bool _hasManualIncluded = false;
  List<XFile> _selectedImages = [];
  List<Uint8List> _webImages = [];
  final ImagePicker _picker = ImagePicker();

  final List<String> _categories = [
    'Home', 'Fashion', 'Tech', 'Books', 'Sports', 'Automotive', 'Beauty', 'Garden', 'Other'
  ];

  final List<String> _conditions = [
    'New', 'Like New', 'Good', 'Fair', 'Poor'
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _quantityController.dispose();
    _yearController.dispose();
    _brandController.dispose();
    _modelController.dispose();
    _dimensionsController.dispose();
    _weightController.dispose();
    _materialController.dispose();
    _colorController.dispose();
    _workingConditionController.dispose();
    super.dispose();
  }

  Future<void> _pickImages() async {
    try {
      final List<XFile> images = await _picker.pickMultiImage();
      if (images.isNotEmpty) {
        setState(() {
          _selectedImages = images;
        });
        
        // For web, also load the image bytes
        if (kIsWeb) {
          _webImages.clear();
          for (XFile image in images) {
            final bytes = await image.readAsBytes();
            _webImages.add(bytes);
          }
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking images: $e')),
      );
    }
  }

  void _removeImage(int index) {
    setState(() {
      _selectedImages.removeAt(index);
      if (kIsWeb && index < _webImages.length) {
        _webImages.removeAt(index);
      }
    });
  }

  Future<void> _addProduct() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_selectedImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one image')),
      );
      return;
    }

    // Handle image URLs differently for web and mobile
    List<String> imageUrls = [];
    if (kIsWeb) {
      // Store images in web storage and use IDs as URLs
      for (int i = 0; i < _webImages.length; i++) {
        final imageId = await WebImageStorage.storeImage(_webImages[i]);
        if (imageId.isNotEmpty) {
          imageUrls.add('web:$imageId'); // Prefix to identify web images
        }
      }
    } else {
      // Use file paths for mobile
      imageUrls = _selectedImages.map((file) => file.path).toList();
    }

    final product = Product(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: _titleController.text,
      description: _descriptionController.text,
      category: _selectedCategory,
      price: double.parse(_priceController.text),
      quantity: int.parse(_quantityController.text),
      condition: _selectedCondition,
      yearOfManufacture: _yearController.text.isNotEmpty ? _yearController.text : null,
      brand: _brandController.text.isNotEmpty ? _brandController.text : null,
      model: _modelController.text.isNotEmpty ? _modelController.text : null,
      dimensions: _dimensionsController.text.isNotEmpty ? _dimensionsController.text : null,
      weight: _weightController.text.isNotEmpty ? _weightController.text : null,
      material: _materialController.text.isNotEmpty ? _materialController.text : null,
      color: _colorController.text.isNotEmpty ? _colorController.text : null,
      isEcoFriendly: _isEcoFriendly,
      hasManualIncluded: _hasManualIncluded,
      workingConditionDescription: _workingConditionController.text.isNotEmpty 
          ? _workingConditionController.text : null,
      imageUrls: imageUrls,
      sellerId: widget.sellerId,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    final success = await ProductStorage.addProduct(product);
    
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Product added successfully!')),
      );
      Navigator.pop(context, true); // Return true to indicate success
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to add product')),
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
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Add a new Product',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),

                // Image Picker Section - Enhanced for Multiple Images
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Add Images Button
                    GestureDetector(
                      onTap: _pickImages,
                      child: Container(
                        height: 120,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.white),
                          borderRadius: BorderRadius.circular(8),
                          color: Colors.grey[900],
                        ),
                        child: const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_photo_alternate_outlined, 
                                 color: Colors.white, size: 36),
                            SizedBox(height: 8),
                            Text('Add Product Images', 
                                 style: TextStyle(color: Colors.white, fontSize: 16)),
                            SizedBox(height: 4),
                            Text('(Tap to select multiple)', 
                                 style: TextStyle(color: Colors.grey, fontSize: 12)),
                          ],
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Display Selected Images
                    if (_selectedImages.isNotEmpty) ...[
                      Text(
                        'Selected Images (${_selectedImages.length})',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      
                      SizedBox(
                        height: 120,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _selectedImages.length + 1, // +1 for add more button
                          itemBuilder: (context, index) {
                            if (index == _selectedImages.length) {
                              // Add More Button
                              return GestureDetector(
                                onTap: _pickImages,
                                child: Container(
                                  width: 100,
                                  margin: const EdgeInsets.only(right: 12),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: Colors.white, style: BorderStyle.solid),
                                    borderRadius: BorderRadius.circular(8),
                                    color: Colors.grey[800],
                                  ),
                                  child: const Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(Icons.add, color: Colors.white, size: 24),
                                      SizedBox(height: 4),
                                      Text('Add More', 
                                           style: TextStyle(color: Colors.white, fontSize: 10)),
                                    ],
                                  ),
                                ),
                              );
                            }
                            
                            // Image Preview
                            return Container(
                              width: 100,
                              margin: const EdgeInsets.only(right: 12),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.white),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Stack(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: kIsWeb
                                        ? (index < _webImages.length
                                            ? Image.memory(
                                                _webImages[index],
                                                width: 100,
                                                height: 120,
                                                fit: BoxFit.cover,
                                              )
                                            : Container(
                                                width: 100,
                                                height: 120,
                                                color: Colors.grey[800],
                                                child: const Icon(Icons.image, color: Colors.white),
                                              ))
                                        : Image.file(
                                            File(_selectedImages[index].path),
                                            width: 100,
                                            height: 120,
                                            fit: BoxFit.cover,
                                          ),
                                  ),
                                  
                                  // Remove Button
                                  Positioned(
                                    top: 4,
                                    right: 4,
                                    child: GestureDetector(
                                      onTap: () => _removeImage(index),
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: const BoxDecoration(
                                          color: Colors.red,
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(
                                          Icons.close,
                                          color: Colors.white,
                                          size: 16,
                                        ),
                                      ),
                                    ),
                                  ),
                                  
                                  // Image Number
                                  Positioned(
                                    bottom: 4,
                                    left: 4,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.black.withOpacity(0.7),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: Text(
                                        '${index + 1}',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                      
                      const SizedBox(height: 8),
                      
                      Row(
                        children: [
                          Icon(Icons.info_outline, color: Colors.grey[400], size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'First image will be used as the main product image',
                              style: TextStyle(color: Colors.grey[400], fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 20),

                // Product Title
                _buildTextField(
                  controller: _titleController,
                  label: 'Product Title',
                  isRequired: true,
                ),
                const SizedBox(height: 16),

                // Product Category
                _buildDropdownField(
                  value: _selectedCategory,
                  label: 'Product Category',
                  items: _categories,
                  onChanged: (value) => setState(() => _selectedCategory = value!),
                ),
                const SizedBox(height: 16),

                // Product Description
                _buildTextField(
                  controller: _descriptionController,
                  label: 'Product Description',
                  isRequired: true,
                  maxLines: 3,
                ),
                const SizedBox(height: 16),

                // Price
                _buildTextField(
                  controller: _priceController,
                  label: 'Price',
                  isRequired: true,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),

                // Quantity
                _buildTextField(
                  controller: _quantityController,
                  label: 'Quantity',
                  isRequired: true,
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),

                // Condition
                _buildDropdownField(
                  value: _selectedCondition,
                  label: 'Condition',
                  items: _conditions,
                  onChanged: (value) => setState(() => _selectedCondition = value!),
                ),
                const SizedBox(height: 16),

                // Year of Manufacture
                _buildTextField(
                  controller: _yearController,
                  label: 'Year of Manufacture (if applicable)',
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),

                // Brand
                _buildTextField(
                  controller: _brandController,
                  label: 'Brand',
                ),
                const SizedBox(height: 16),

                // Model
                _buildTextField(
                  controller: _modelController,
                  label: 'Model',
                ),
                const SizedBox(height: 16),

                // Dimensions
                _buildTextField(
                  controller: _dimensionsController,
                  label: 'Dimensions (Length, Width, Height)',
                ),
                const SizedBox(height: 16),

                // Weight
                _buildTextField(
                  controller: _weightController,
                  label: 'Weight',
                ),
                const SizedBox(height: 16),

                // Material
                _buildTextField(
                  controller: _materialController,
                  label: 'Material',
                ),
                const SizedBox(height: 16),

                // Color
                _buildTextField(
                  controller: _colorController,
                  label: 'Color',
                ),
                const SizedBox(height: 16),

                // Eco-friendly Packaging Checkbox
                CheckboxListTile(
                  title: const Text('Eco-friendly Packaging (Checkbox - implies a Boolean Field)',
                                   style: TextStyle(color: Colors.white)),
                  value: _isEcoFriendly,
                  onChanged: (value) => setState(() => _isEcoFriendly = value ?? false),
                  checkColor: Colors.black,
                  activeColor: Colors.green,
                  side: const BorderSide(color: Colors.white),
                  controlAffinity: ListTileControlAffinity.leading,
                ),
                const SizedBox(height: 8),

                // Manual/Instructions Included Checkbox
                CheckboxListTile(
                  title: const Text('Manual/Instructions Included (Checkbox - implies a Boolean Field)',
                                   style: TextStyle(color: Colors.white)),
                  value: _hasManualIncluded,
                  onChanged: (value) => setState(() => _hasManualIncluded = value ?? false),
                  checkColor: Colors.black,
                  activeColor: Colors.green,
                  side: const BorderSide(color: Colors.white),
                  controlAffinity: ListTileControlAffinity.leading,
                ),
                const SizedBox(height: 16),

                // Working Condition Description
                _buildTextField(
                  controller: _workingConditionController,
                  label: 'Working Condition Description',
                  maxLines: 2,
                ),
                const SizedBox(height: 30),

                // Add Item Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _addProduct,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Add Item', style: TextStyle(fontSize: 18)),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    bool isRequired = false,
    int maxLines = 1,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      style: const TextStyle(color: Colors.white),
      maxLines: maxLines,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.grey),
        enabledBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
        focusedBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.green),
        ),
        errorBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.red),
        ),
        focusedErrorBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.red),
        ),
      ),
      validator: isRequired ? (value) {
        if (value == null || value.trim().isEmpty) {
          return 'This field is required';
        }
        if (keyboardType == TextInputType.number) {
          if (double.tryParse(value) == null) {
            return 'Please enter a valid number';
          }
        }
        return null;
      } : null,
    );
  }

  Widget _buildDropdownField({
    required String value,
    required String label,
    required List<String> items,
    required void Function(String?) onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.grey),
        enabledBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
        focusedBorder: const OutlineInputBorder(
          borderSide: BorderSide(color: Colors.green),
        ),
      ),
      dropdownColor: Colors.grey[800],
      items: items.map((String item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item, style: const TextStyle(color: Colors.white)),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }
}
