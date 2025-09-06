import 'package:flutter/material.dart';
import '../user_storage.dart';
import '../pages/add_product_page.dart';
import '../pages/my_listings_page.dart';
import '../pages/cart_page.dart';
import '../dashboard_page.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    // Get current user info
    final users = UserStorage.getAllUsers();
    final currentUser = users.isNotEmpty ? users.first : null;
    
    // Check if user is logged in by checking current route
    final currentRoute = ModalRoute.of(context)?.settings.name;
    final isLoggedIn = currentRoute == '/dashboard' || 
                      currentRoute?.contains('/') == false ||
                      currentUser != null;

    return Drawer(
      backgroundColor: Colors.black,
      child: Column(
        children: [
          // Drawer Header
          Container(
            height: 200,
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.green.shade600, Colors.green.shade400],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white,
                        border: Border.all(color: Colors.white, width: 3),
                      ),
                      child: const Icon(
                        Icons.person,
                        size: 40,
                        color: Colors.green,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      isLoggedIn 
                          ? (currentUser?['displayName'] ?? 'User')
                          : 'Welcome to EcoFinds',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      isLoggedIn
                          ? (currentUser?['email'] ?? 'user@example.com')
                          : 'Please login to access all features',
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          // Navigation Items
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                // Always available
                _buildDrawerItem(
                  context: context,
                  icon: Icons.home,
                  title: 'Home',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => const DashboardPage()),
                      (route) => false,
                    );
                  },
                ),
                
                // Show these only if user is logged in
                if (isLoggedIn) ...[
                  _buildDrawerItem(
                    context: context,
                    icon: Icons.dashboard,
                    title: 'Dashboard',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (context) => const DashboardPage()),
                        (route) => false,
                      );
                    },
                  ),
                  _buildDrawerItem(
                    context: context,
                    icon: Icons.add_business,
                    title: 'Add Product',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => AddProductPage(
                            sellerId: currentUser?['email'] ?? 'unknown',
                          ),
                        ),
                      );
                    },
                  ),
                  _buildDrawerItem(
                    context: context,
                    icon: Icons.inventory,
                    title: 'My Listings',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => MyListingsPage(
                            sellerId: currentUser?['email'] ?? 'unknown',
                          ),
                        ),
                      );
                    },
                  ),
                ],
                
                // Always show cart
                _buildDrawerItem(
                  context: context,
                  icon: Icons.shopping_cart,
                  title: 'My Cart',
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CartPage()),
                    );
                  },
                ),
                
                // Show these only if user is logged in  
                if (isLoggedIn) ...[
                  _buildDrawerItem(
                    context: context,
                    icon: Icons.shopping_bag,
                    title: 'My Purchases',
                    onTap: () {
                      Navigator.pop(context);
                      _showMyPurchases(context);
                    },
                  ),
                  _buildDrawerItem(
                    context: context,
                    icon: Icons.person,
                    title: 'Profile',
                    onTap: () {
                      Navigator.pop(context);
                      _editProfile(context, currentUser);
                    },
                  ),
                ],
                
                // Show login/signup if not logged in
                if (!isLoggedIn) ...[
                  const Divider(color: Colors.grey),
                  _buildDrawerItem(
                    context: context,
                    icon: Icons.login,
                    title: 'Login',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, '/login');
                    },
                  ),
                  _buildDrawerItem(
                    context: context,
                    icon: Icons.person_add,
                    title: 'Sign Up',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, '/signup');
                    },
                  ),
                ],
                
                const Divider(color: Colors.grey),
                _buildDrawerItem(
                  context: context,
                  icon: Icons.settings,
                  title: 'Settings',
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Settings coming soon!')),
                    );
                  },
                ),
                _buildDrawerItem(
                  context: context,
                  icon: Icons.help_outline,
                  title: 'Help & Support',
                  onTap: () {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Help & Support coming soon!')),
                    );
                  },
                ),
                _buildDrawerItem(
                  context: context,
                  icon: Icons.info_outline,
                  title: 'About',
                  onTap: () {
                    Navigator.pop(context);
                    _showAbout(context);
                  },
                ),
              ],
            ),
          ),
          
          // Logout Section - only show if logged in
          if (isLoggedIn)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: Colors.grey.shade700)),
              ),
              child: _buildDrawerItem(
                context: context,
                icon: Icons.logout,
                title: 'Logout',
                onTap: () {
                  Navigator.pop(context);
                  _logout(context);
                },
                isLogout: true,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem({
    required BuildContext context,
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isLogout = false,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: isLogout ? Colors.red : Colors.white,
        size: 24,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isLogout ? Colors.red : Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
      onTap: onTap,
      hoverColor: Colors.grey.withOpacity(0.1),
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
    );
  }

  void _showMyPurchases(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('My Purchases feature coming soon!')),
    );
  }

  void _editProfile(BuildContext context, Map<String, String>? currentUser) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final nameController = TextEditingController(text: currentUser?['displayName'] ?? '');
        final emailController = TextEditingController(text: currentUser?['email'] ?? '');
        final infoController = TextEditingController(text: 'User other info..');
        
        return AlertDialog(
          backgroundColor: Colors.grey[900],
          title: const Text('Edit Profile', style: TextStyle(color: Colors.white)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: nameController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Display Name',
                    labelStyle: TextStyle(color: Colors.white70),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white70),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.green),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: emailController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    labelStyle: TextStyle(color: Colors.white70),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white70),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.green),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: infoController,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    labelText: 'Additional Info',
                    labelStyle: TextStyle(color: Colors.white70),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white70),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.green),
                    ),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Profile updated successfully!')),
                );
              },
              child: const Text('Save', style: TextStyle(color: Colors.green)),
            ),
          ],
        );
      },
    );
  }

  void _showAbout(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Colors.grey[900],
          title: const Text('About EcoFinds', style: TextStyle(color: Colors.white)),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'EcoFinds - Your Sustainable Marketplace',
                style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              Text(
                'Version: 1.0.0',
                style: TextStyle(color: Colors.white70),
              ),
              SizedBox(height: 10),
              Text(
                'A platform for buying and selling eco-friendly products.',
                style: TextStyle(color: Colors.white70),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close', style: TextStyle(color: Colors.green)),
            ),
          ],
        );
      },
    );
  }

  void _logout(BuildContext context) {
    Navigator.pushReplacementNamed(context, '/');
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Logged out successfully')),
    );
  }
}
