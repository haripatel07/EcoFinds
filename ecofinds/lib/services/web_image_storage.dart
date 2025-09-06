import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class WebImageStorage {
  static const String _webImagesKey = 'web_images';

  // Store image bytes with a unique ID
  static Future<String> storeImage(Uint8List imageBytes) async {
    if (!kIsWeb) {
      return ''; // Not needed for mobile
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final imageId = DateTime.now().millisecondsSinceEpoch.toString();
      final base64String = base64Encode(imageBytes);
      
      // Get existing images
      final existingImages = await getAllImages();
      existingImages[imageId] = base64String;
      
      // Store back
      final imagesJson = json.encode(existingImages);
      await prefs.setString(_webImagesKey, imagesJson);
      
      return imageId;
    } catch (e) {
      print('Error storing web image: $e');
      return '';
    }
  }

  // Get image bytes by ID
  static Future<Uint8List?> getImage(String imageId) async {
    if (!kIsWeb) {
      return null; // Not needed for mobile
    }

    try {
      final images = await getAllImages();
      final base64String = images[imageId];
      if (base64String != null) {
        return base64Decode(base64String);
      }
    } catch (e) {
      print('Error getting web image: $e');
    }
    return null;
  }

  // Get all images
  static Future<Map<String, String>> getAllImages() async {
    if (!kIsWeb) {
      return {}; // Not needed for mobile
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final imagesJson = prefs.getString(_webImagesKey);
      
      if (imagesJson != null) {
        final Map<String, dynamic> decoded = json.decode(imagesJson);
        return decoded.cast<String, String>();
      }
    } catch (e) {
      print('Error loading web images: $e');
    }
    return {};
  }

  // Delete an image
  static Future<bool> deleteImage(String imageId) async {
    if (!kIsWeb) {
      return true; // Not needed for mobile
    }

    try {
      final prefs = await SharedPreferences.getInstance();
      final images = await getAllImages();
      images.remove(imageId);
      
      final imagesJson = json.encode(images);
      await prefs.setString(_webImagesKey, imagesJson);
      return true;
    } catch (e) {
      print('Error deleting web image: $e');
      return false;
    }
  }
}
