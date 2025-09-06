import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../services/web_image_storage.dart';

class ProductImageWidget extends StatefulWidget {
  final String imagePath;
  final double? width;
  final double? height;
  final BoxFit fit;

  const ProductImageWidget({
    super.key,
    required this.imagePath,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
  });

  @override
  State<ProductImageWidget> createState() => _ProductImageWidgetState();
}

class _ProductImageWidgetState extends State<ProductImageWidget> {
  Uint8List? _webImageBytes;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  Future<void> _loadImage() async {
    if (kIsWeb && widget.imagePath.startsWith('web:')) {
      setState(() => _isLoading = true);
      final imageId = widget.imagePath.substring(4); // Remove 'web:' prefix
      final imageBytes = await WebImageStorage.getImage(imageId);
      setState(() {
        _webImageBytes = imageBytes;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      if (widget.imagePath.startsWith('web:')) {
        if (_isLoading) {
          return Container(
            width: widget.width,
            height: widget.height,
            color: Colors.grey[800],
            child: const Center(
              child: CircularProgressIndicator(color: Colors.white),
            ),
          );
        }
        
        if (_webImageBytes != null) {
          return Image.memory(
            _webImageBytes!,
            width: widget.width,
            height: widget.height,
            fit: widget.fit,
          );
        }
      }
      
      // Fallback for web
      return Container(
        width: widget.width,
        height: widget.height,
        color: Colors.grey[800],
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.image, color: Colors.white, size: 32),
              SizedBox(height: 4),
              Text('Image', style: TextStyle(color: Colors.white, fontSize: 12)),
            ],
          ),
        ),
      );
    }

    // Mobile - use File
    return Image.file(
      File(widget.imagePath),
      width: widget.width,
      height: widget.height,
      fit: widget.fit,
      errorBuilder: (context, error, stackTrace) {
        return Container(
          width: widget.width,
          height: widget.height,
          color: Colors.grey[800],
          child: const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.image_not_supported, color: Colors.white, size: 32),
                SizedBox(height: 4),
                Text('Image Error', style: TextStyle(color: Colors.white, fontSize: 12)),
              ],
            ),
          ),
        );
      },
    );
  }
}
