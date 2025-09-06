class Product {
  final String id;
  final String title;
  final String description;
  final String category;
  final double price;
  final int quantity;
  final String condition;
  final String? yearOfManufacture;
  final String? brand;
  final String? model;
  final String? dimensions;
  final String? weight;
  final String? material;
  final String? color;
  final bool isEcoFriendly;
  final bool hasManualIncluded;
  final String? workingConditionDescription;
  final List<String> imageUrls;
  final String sellerId;
  final DateTime createdAt;
  final DateTime updatedAt;

  Product({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.price,
    required this.quantity,
    required this.condition,
    this.yearOfManufacture,
    this.brand,
    this.model,
    this.dimensions,
    this.weight,
    this.material,
    this.color,
    this.isEcoFriendly = false,
    this.hasManualIncluded = false,
    this.workingConditionDescription,
    required this.imageUrls,
    required this.sellerId,
    required this.createdAt,
    required this.updatedAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'category': category,
      'price': price,
      'quantity': quantity,
      'condition': condition,
      'yearOfManufacture': yearOfManufacture,
      'brand': brand,
      'model': model,
      'dimensions': dimensions,
      'weight': weight,
      'material': material,
      'color': color,
      'isEcoFriendly': isEcoFriendly,
      'hasManualIncluded': hasManualIncluded,
      'workingConditionDescription': workingConditionDescription,
      'imageUrls': imageUrls,
      'sellerId': sellerId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      category: json['category'],
      price: json['price'].toDouble(),
      quantity: json['quantity'],
      condition: json['condition'],
      yearOfManufacture: json['yearOfManufacture'],
      brand: json['brand'],
      model: json['model'],
      dimensions: json['dimensions'],
      weight: json['weight'],
      material: json['material'],
      color: json['color'],
      isEcoFriendly: json['isEcoFriendly'] ?? false,
      hasManualIncluded: json['hasManualIncluded'] ?? false,
      workingConditionDescription: json['workingConditionDescription'],
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      sellerId: json['sellerId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Product copyWith({
    String? title,
    String? description,
    String? category,
    double? price,
    int? quantity,
    String? condition,
    String? yearOfManufacture,
    String? brand,
    String? model,
    String? dimensions,
    String? weight,
    String? material,
    String? color,
    bool? isEcoFriendly,
    bool? hasManualIncluded,
    String? workingConditionDescription,
    List<String>? imageUrls,
  }) {
    return Product(
      id: id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      price: price ?? this.price,
      quantity: quantity ?? this.quantity,
      condition: condition ?? this.condition,
      yearOfManufacture: yearOfManufacture ?? this.yearOfManufacture,
      brand: brand ?? this.brand,
      model: model ?? this.model,
      dimensions: dimensions ?? this.dimensions,
      weight: weight ?? this.weight,
      material: material ?? this.material,
      color: color ?? this.color,
      isEcoFriendly: isEcoFriendly ?? this.isEcoFriendly,
      hasManualIncluded: hasManualIncluded ?? this.hasManualIncluded,
      workingConditionDescription: workingConditionDescription ?? this.workingConditionDescription,
      imageUrls: imageUrls ?? this.imageUrls,
      sellerId: sellerId,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }
}
