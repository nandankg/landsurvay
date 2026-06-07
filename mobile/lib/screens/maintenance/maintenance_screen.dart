import 'package:flutter/material.dart';
import '../../config/app_theme.dart';

/// Full-screen 503 / maintenance page shown on launch when the backend
/// reports maintenance mode. This is the first and only screen the user sees
/// while the service is down.
class MaintenanceScreen extends StatelessWidget {
  final String? message;

  const MaintenanceScreen({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    final text = message ??
        'सेवा अस्थायी रूप से बंद है। कृपया बाद में पुनः प्रयास करें।\n'
            'The service is temporarily down for maintenance. '
            'Please try again later.';

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.cloud_off_rounded,
                  size: 88,
                  color: AppTheme.textPrimary.withOpacity(0.6),
                ),
                const SizedBox(height: 24),
                Text(
                  '503',
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Service Unavailable',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppTheme.textPrimary,
                      ),
                ),
                const SizedBox(height: 16),
                Text(
                  text,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppTheme.textPrimary.withOpacity(0.7),
                        height: 1.5,
                      ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
