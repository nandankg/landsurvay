import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/models.dart';
import '../screens/splash/splash_screen.dart';
import '../screens/security/security_key_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/search/search_screen.dart';
import '../screens/properties/properties_list_screen.dart';
import '../screens/property_detail/property_detail_screen.dart';
import '../screens/documents/document_viewer_screen.dart';

/// Application Router Configuration using GoRouter
class AppRouter {
  static final router = GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,
    routes: [
      // Splash Screen
      GoRoute(
        path: '/',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),

      // Security Key Screen
      GoRoute(
        path: '/security-key',
        name: 'securityKey',
        builder: (context, state) => const SecurityKeyScreen(),
      ),

      // Home Screen
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),

      // Search Screen
      GoRoute(
        path: '/search',
        name: 'search',
        builder: (context, state) => const SearchScreen(),
      ),

      // Properties List Screen
      GoRoute(
        path: '/properties',
        name: 'properties',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return PropertiesListScreen(
            owner: extra?['owner'] as Owner?,
            properties: extra?['properties'] as List<Property>? ?? [],
            searchType: extra?['searchType'] as String? ?? '',
            searchValue: extra?['searchValue'] as String? ?? '',
          );
        },
      ),

      // Property Detail Screen
      GoRoute(
        path: '/property/:id',
        name: 'propertyDetail',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          final extra = state.extra as Map<String, dynamic>?;
          return PropertyDetailScreen(
            propertyId: id,
            property: extra?['property'] as Property?,
            owner: extra?['owner'] as Owner?,
          );
        },
      ),

      // Document Viewer Screen (Secure - requires password)
      GoRoute(
        path: '/document/:id',
        name: 'documentViewer',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          final extra = state.extra as Map<String, dynamic>?;
          return DocumentViewerScreen(
            documentId: id,
            document: extra?['document'] as PropertyDocument?,
            documents: extra?['documents'] as List<PropertyDocument>?,
            initialIndex: extra?['initialIndex'] as int? ?? 0,
            propertyUniqueId: extra?['propertyUniqueId'] as String?,
          );
        },
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => context.go('/home'),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );
}
