class UserStorage {
  static final List<Map<String, String>> _users = [];

  static bool registerUser(String displayName, String email, String password) {
    // Check if email already exists
    if (_users.any((user) => user['email'] == email)) {
      return false; // Email already exists
    }
    
    // Add new user
    _users.add({
      'displayName': displayName,
      'email': email,
      'password': password, // In real app, this should be hashed
    });
    
    return true; // Registration successful
  }

  static bool validateLogin(String emailOrUsername, String password) {
    // Check if user exists with matching email/username and password
    return _users.any((user) =>
        (user['email'] == emailOrUsername || user['displayName'] == emailOrUsername) &&
        user['password'] == password);
  }

  static bool userExists(String emailOrUsername) {
    return _users.any((user) =>
        user['email'] == emailOrUsername || user['displayName'] == emailOrUsername);
  }

  static Map<String, String>? getUser(String emailOrUsername) {
    try {
      return _users.firstWhere((user) =>
          user['email'] == emailOrUsername || user['displayName'] == emailOrUsername);
    } catch (e) {
      return null;
    }
  }

  static List<Map<String, String>> getAllUsers() {
    return List.from(_users); // Return copy for debugging
  }
}
