import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/integrations/external_integration.dart';
import '../../../../core/integrations/integration_repository.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/error_view.dart';

/// Admin screen for managing external integrations according to Sections 68, 78, and 83.
class AdminIntegrationsScreen extends ConsumerStatefulWidget {
  const AdminIntegrationsScreen({super.key});

  @override
  ConsumerState<AdminIntegrationsScreen> createState() =>
      _AdminIntegrationsScreenState();
}

class _AdminIntegrationsScreenState
    extends ConsumerState<AdminIntegrationsScreen> {
  final Map<String, bool> _testingMap = {};

  Future<void> _testConnection(IntegrationProviderItem item) async {
    setState(() => _testingMap[item.id] = true);
    final repo = ref.read(integrationRepositoryProvider);
    final health = await repo.testProvider(item.id);
    if (!mounted) return;
    setState(() => _testingMap[item.id] = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor:
            health.httpStatus == 200 ? Colors.green : Colors.orange,
        content: Text(
          '${item.name}: ${health.status} (${health.latencyMs}ms latency, HTTP ${health.httpStatus})',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  void _showAddIntegrationDialog() {
    final nameCtrl = TextEditingController();
    final providerCtrl = TextEditingController();
    final baseUrlCtrl = TextEditingController();
    String authType = 'Bearer Token';
    String type = 'REST_API';
    final platforms = <String>{'iOS', 'Android', 'Web'};

    showDialog(
      context: context,
      builder: (dialogCtx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Row(
            children: [
              Icon(Icons.add_link_rounded, color: AppTheme.brand),
              SizedBox(width: 8),
              Text('Add External Integration', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          content: SingleChildScrollView(
            child: SizedBox(
              width: 480,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Register third-party API or partner connector (Section 83). Secrets are secured server-side.',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nameCtrl,
                    decoration: InputDecoration(
                      labelText: 'Integration Name',
                      hintText: 'e.g. Stripe Global, Twilio SMS',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: providerCtrl,
                    decoration: InputDecoration(
                      labelText: 'Provider ID',
                      hintText: 'e.g. stripe, twilio',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: baseUrlCtrl,
                    decoration: InputDecoration(
                      labelText: 'Base URL',
                      hintText: 'https://api.provider.com/v1',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: type,
                          decoration: InputDecoration(
                            labelText: 'Type',
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          ),
                          items: const [
                            DropdownMenuItem(value: 'REST_API', child: Text('REST API')),
                            DropdownMenuItem(value: 'MCP_SERVICE', child: Text('MCP Service')),
                            DropdownMenuItem(value: 'WEBHOOK', child: Text('Webhook')),
                            DropdownMenuItem(value: 'SDK', child: Text('Official SDK')),
                          ],
                          onChanged: (v) {
                            if (v != null) setDialogState(() => type = v);
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: authType,
                          decoration: InputDecoration(
                            labelText: 'Auth Type',
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          ),
                          items: const [
                            DropdownMenuItem(value: 'Bearer Token', child: Text('Bearer Token')),
                            DropdownMenuItem(value: 'OAuth2', child: Text('OAuth2 Flow')),
                            DropdownMenuItem(value: 'API Key Header', child: Text('API Key')),
                            DropdownMenuItem(value: 'None', child: Text('Public Link')),
                          ],
                          onChanged: (v) {
                            if (v != null) setDialogState(() => authType = v);
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Text('Supported Platforms:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 8,
                    children: ['iOS', 'Android', 'Web'].map((p) {
                      final selected = platforms.contains(p);
                      return FilterChip(
                        label: Text(p),
                        selected: selected,
                        onSelected: (val) {
                          setDialogState(() {
                            if (val) {
                              platforms.add(p);
                            } else if (platforms.length > 1) {
                              platforms.remove(p);
                            }
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.emerald.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.emerald.withValues(alpha: 0.3)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.shield_rounded, color: Colors.emerald, size: 18),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Secret Status: Configured ✓ (Protected in backend environment)',
                            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.emerald),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogCtx),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () async {
                if (nameCtrl.text.isEmpty || baseUrlCtrl.text.isEmpty) return;
                Navigator.pop(dialogCtx);
                final config = IntegrationConfig(
                  id: providerCtrl.text.isNotEmpty ? providerCtrl.text.toLowerCase() : 'int_${DateTime.now().millisecondsSinceEpoch}',
                  name: nameCtrl.text,
                  provider: providerCtrl.text.isNotEmpty ? providerCtrl.text : nameCtrl.text,
                  type: type,
                  baseUrl: baseUrlCtrl.text,
                  authType: authType,
                  capabilities: const ['READ', 'SYNC'],
                  platforms: platforms.toList(),
                );
                final ok = await ref.read(integrationRepositoryProvider).createIntegration(config);
                if (ok) {
                  ref.invalidate(integrationsListProvider);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Integration registered successfully!')),
                    );
                  }
                }
              },
              child: const Text('Add Connector'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final integrations = ref.watch(integrationsListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('External Integrations Hub'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Refresh Status',
            onPressed: () => ref.invalidate(integrationsListProvider),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddIntegrationDialog,
        icon: const Icon(Icons.add_rounded),
        label: const Text('Add Integration'),
        backgroundColor: AppTheme.brand,
      ),
      body: integrations.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => ErrorView(
          message: e.toString(),
          onRetry: () => ref.invalidate(integrationsListProvider),
        ),
        data: (items) => items.isEmpty
            ? const EmptyState(
                icon: Icons.hub_rounded,
                title: 'No Integrations Configured',
                message: 'Add an external provider or MCP service to begin.',
              )
            : ListView.builder(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
                itemCount: items.length,
                itemBuilder: (context, index) {
                  final item = items[index];
                  final isTesting = _testingMap[item.id] ?? false;

                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(
                        color: item.status.isOperational
                            ? Colors.emerald.withValues(alpha: 0.3)
                            : Colors.grey.withValues(alpha: 0.2),
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: AppTheme.brand.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(Icons.cloud_sync_rounded, color: AppTheme.brand, size: 22),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.name,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      item.category,
                                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                                    ),
                                  ],
                                ),
                              ),
                              Switch(
                                value: item.enabled,
                                activeColor: AppTheme.brand,
                                onChanged: (val) async {
                                  await ref.read(integrationRepositoryProvider).toggleProvider(item.id, val);
                                  ref.invalidate(integrationsListProvider);
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Divider(height: 1),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 6,
                            children: [
                              _StatusBadge(status: item.status),
                              _InfoPill(
                                icon: Icons.speed_rounded,
                                label: '${item.health.latencyMs}ms',
                                color: Colors.blueGrey,
                              ),
                              _InfoPill(
                                icon: Icons.devices_rounded,
                                label: item.enabledPlatforms.join(', '),
                                color: Colors.indigo,
                              ),
                              const _InfoPill(
                                icon: Icons.lock_outline_rounded,
                                label: 'Configured ✓',
                                color: Colors.teal,
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                item.lastSuccessfulSync != null
                                    ? 'Synced: ${item.lastSuccessfulSync!.hour}:${item.lastSuccessfulSync!.minute.toString().padLeft(2, '0')}'
                                    : 'Live sync active',
                                style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                              ),
                              Row(
                                children: [
                                  OutlinedButton.icon(
                                    onPressed: isTesting ? null : () => _testConnection(item),
                                    style: OutlinedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      visualDensity: VisualDensity.compact,
                                    ),
                                    icon: isTesting
                                        ? const SizedBox(
                                            width: 14,
                                            height: 14,
                                            child: CircularProgressIndicator(strokeWidth: 2),
                                          )
                                        : const Icon(Icons.network_check_rounded, size: 16),
                                    label: const Text('Test Ping', style: TextStyle(fontSize: 12)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});
  final IntegrationStatus status;

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;

    switch (status) {
      case IntegrationStatus.connected:
        bg = Colors.emerald.withValues(alpha: 0.12);
        fg = Colors.emerald.shade800;
        break;
      case IntegrationStatus.rateLimited:
        bg = Colors.amber.withValues(alpha: 0.15);
        fg = Colors.amber.shade900;
        break;
      case IntegrationStatus.maintenance:
        bg = Colors.blue.withValues(alpha: 0.15);
        fg = Colors.blue.shade900;
        break;
      default:
        bg = Colors.grey.withValues(alpha: 0.15);
        fg = Colors.grey.shade800;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
      child: Text(
        status.label,
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: fg),
      ),
    );
  }
}

class _InfoPill extends StatelessWidget {
  const _InfoPill({required this.icon, required this.label, required this.color});
  final IconData icon;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color),
          ),
        ],
      ),
    );
  }
}
