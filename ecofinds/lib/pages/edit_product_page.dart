import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import '../models/product.dart';
import '../services/product_storage.dart';
import '../widgets/app_drawer.dart';

class EditProductPage extends StatefulWidget {
  final Product product;

  const EditProductPage({super.key, required this.product});

  @override
  State<EditProductPage> createState() => _EditProductPageState();
}

class _EditProductPageState extends State<EditProductPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _priceController;
  late TextEditingController _quantityController;
  late TextEditingController _yearController;
  late TextEditingController _brandController;
  late TextEditingController _modelController;
  late TextEditingController _dimensionsController;
  late TextEditingController _weightController;
  late TextEditingController _materialController;
  late TextEditingController _colorController;
  late TextEditingController _workingConditionController;

  late String _selectedCategory;
  late String _selectedCondition;
  late bool _isEcoFriendly;
  late bool _hasManualIncluded;
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
  void initState() {
    super.initState();
    _initializeControllers();
    _loadExistingImages();
  }

  void _initializeControllers() {
    _titleController = TextEditingController(text: widget.product.title);
    _descriptionController = TextEditingController(text: widget.product.description);
    _priceController = TextEditingController(text: widget.product.price.toString());
    _quantityController = TextEditingController(text: widget.product.quantity.toString());
    _yearController = TextEditingController(text: widget.product.yearOfManufacture ?? '');
    _brandController = TextEditingController(text: widget.product.brand ?? '');
    _modelController = TextEditingController(text: widget.product.model ?? '');
    _dimensionsController = TextEditingController(text: widget.product.dimensions ?? '');
    _weightController = TextEditingController(text: widget.product.weight ?? '');
    _materialController = TextEditingController(text: widget.product.material ?? '');
    _colorController = TextEditingController(text: widget.product.color ?? '');
    _workingConditionController = TextEditingController(text: widget.product.workingConditionDescription ?? '');
    
    _selectedCategory = widget.product.category;
    _selectedCondition = widget.product.condition;
    _isEcoFriendly = widget.product.isEcoFriendly;
    _hasManualIncluded = widget.product.hasManualIncluded;
  }

  void _loadExistingImages() {
    // For now, we'll create empty XFile list since we can't recreate XFile from paths
    // In a real app, you'd store the images properly or use a different approach
    _selectedImages = [];
  }

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

  Future<void> _updateProduct() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_selectedImages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select at least one image')),
      );
      return;
    }

    final imageUrls = _selectedImages.map((file) => file.path).toList();

    final updatedProduct = widget.product.copyWith(
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
    );

    final success = await ProductStorage.updateProduct(updatedProduct);
    
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Product updated successfully!')),
      );
      Navigator.pop(context, true); // Return true to indicate success
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update product')),
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
                  'Edit Product',
                  style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),

                // Image Picker Section
                GestureDetector(
                  onTap: _pickImages,
                  child: Container(
                    height: 200,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.white),
                      borderRadius: BorderRadius.circular(8),
                      color: Colors.grey[900],
                    ),
                    child: _selectedImages.isEmpty
                        ? const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.add_photo_alternate_outlined, 
                                   color: Colors.white, size: 48),
                              SizedBox(height: 8),
                              Text('Add product\nImage', 
                                   style: TextStyle(color: Colors.white),
                                   textAlign: TextAlign.center),
                            ],
                          )
                        : ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: kIsWeb
                                ? (_webImages.isNotEmpty
                                    ? Image.memory(
                                        _webImages.first,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                      )
                                    : Container(
                                        color: Colors.grey[800],
                                        child: const Center(
                                          child: Column(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Icon(Icons.image, color: Colors.white, size: 48),
                                              SizedBox(height: 8),
                                              Text('Product Image', 
                                                   style: TextStyle(color: Colors.white)),
                                            ],
                                          ),
                                        ),
                                      ))
                                : Image.file(
                                    File(_selectedImages.first.path),
                                    fit: BoxFit.cover,
                                    width: double.infinity,
                                    errorBuilder: (context, error, stackTrace) {
                                      return Container(
                                        color: Colors.grey[800],
                                        child: const Center(
                                          child: Column(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Icon(Icons.image_not_supported, 
                                                   color: Colors.white, size: 48),
                                              SizedBox(height: 8),
                                              Text('Product Image', 
                                                   style: TextStyle(color: Colors.white)),
                                            ],
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                          ),
                  ),
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

                // Update Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _updateProduct,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Update Product', style: TextStyle(fontSize: 18)),
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
