/// An authenticated user in the application.
///
/// NOTE: Freezed/JsonSerializable codegen is configured but was not run in
/// this environment. The class is hand-written to stay dependency-free.
class AuthUser {
  const AuthUser({
    required this.id,
    this.email = '',
    this.phone = '',
    this.fullName = '',
    this.avatarUrl = '',
    this.roles = const ['customer'],
  });

  final String id;
  final String email;
  final String phone;
  final String fullName;
  final String avatarUrl;
  final List<String> roles;

  /// Returns true if the user possesses an owner or administrator role.
  bool get isOwner => roles.any((r) =>
      r == 'venue_owner' ||
      r == 'institute_owner' ||
      r == 'event_organizer' ||
      r == 'owner' ||
      r == 'administrator' ||
      r == 'super_administrator' ||
      r == 'admin');

  /// Returns true if the user possesses an administrative role.
  bool get isAdmin => roles.any((r) =>
      r == 'administrator' ||
      r == 'super_administrator' ||
      r == 'admin');

  /// Checks whether a specific role is present without hardcoding IDs.
  bool hasRole(String role) => roles.contains(role);

  AuthUser copyWith({
    String? id,
    String? email,
    String? phone,
    String? fullName,
    String? avatarUrl,
    List<String>? roles,
  }) {
    return AuthUser(
      id: id ?? this.id,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      fullName: fullName ?? this.fullName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      roles: roles ?? this.roles,
    );
  }

  factory AuthUser.fromJson(Map<String, dynamic> json) => AuthUser(
    id: json['id'] as String? ?? '',
    email: json['email'] as String? ?? '',
    phone: json['phone'] as String? ?? '',
    fullName: json['full_name'] as String? ?? '',
    avatarUrl: json['avatar_url'] as String? ?? '',
    roles: (json['roles'] as List<dynamic>?)
            ?.map((e) => e.toString())
            .toList() ??
        (json['role'] != null
            ? [json['role'].toString()]
            : const ['customer']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'phone': phone,
    'full_name': fullName,
    'avatar_url': avatarUrl,
    'roles': roles,
  };

  @override
  bool operator ==(Object other) =>
      other is AuthUser && other.id == id && other.email == email;

  @override
  int get hashCode => Object.hash(id, email);
}
