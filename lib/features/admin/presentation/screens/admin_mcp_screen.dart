import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/integrations/integration_repository.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/widgets/empty_state.dart';
import '../../../../core/widgets/error_view.dart';

/// Admin screen for managing Model Context Protocol (MCP) servers and tools (Sections 86 & 87).
class AdminMcpScreen extends ConsumerStatefulWidget {
  const AdminMcpScreen({super.key});

  @override
  ConsumerState<AdminMcpScreen> createState() => _AdminMcpScreenState();
}

class _AdminMcpScreenState extends ConsumerState<AdminMcpScreen> {
  String? _selectedTool;
  final _inputController = TextEditingController();
  Map<String, dynamic>? _executionOutput;
  bool _isExecuting = false;

  void _onSelectTool(Map<String, dynamic> tool) {
    setState(() {
      _selectedTool = tool['name'] as String;
      _executionOutput = null;
      if (_selectedTool == 'check_slot_availability') {
        _inputController.text = json.encode({
          'venueId': 'v_grand_palace',
          'date': '2026-10-15',
          'slotKey': 'morning',
        });
      } else if (_selectedTool == 'create_temporary_hold') {
        _inputController.text = json.encode({
          'venueId': 'v_smash_arena',
          'slotId': 'ts_sa_1',
          'guestName': 'Praveen Kumar',
          'guestPhone': '+919849012345',
        });
      } else if (_selectedTool == 'cancel_booking') {
        _inputController.text = json.encode({
          'bookingId': 'b_live_9081',
          'reason': 'Guest requested reschedule to next week',
        });
      } else {
        _inputController.text = json.encode({
          'city': 'Hyderabad',
          'category': 'sports_turf',
        });
      }
    });
  }

  Future<void> _executeTool(Map<String, dynamic> tool) async {
    final requiresConfirmation = tool['requiresConfirmation'] as bool? ?? false;

    // Section 86: Dangerous mutations require explicit confirmation
    if (requiresConfirmation) {
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Colors.amber),
              SizedBox(width: 8),
              Text('Confirm Mutation', style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          content: Text(
            'The tool "${tool['name']}" performs a critical state modification (${tool['description']}). Do you confirm execution?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('Authorize & Execute'),
            ),
          ],
        ),
      );
      if (confirmed != true) return;
    }

    setState(() {
      _isExecuting = true;
      _executionOutput = null;
    });

    try {
      final params = json.decode(_inputController.text) as Map<String, dynamic>;
      final result = await ref.read(integrationRepositoryProvider).executeMcpTool(
            tool['name'] as String,
            params,
            callerRole: 'admin',
          );
      if (!mounted) return;
      setState(() {
        _executionOutput = result;
        _isExecuting = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _executionOutput = {'success': false, 'error': 'Invalid JSON parameters: $e'};
        _isExecuting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final toolsAsync = ref.watch(mcpToolsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('MCP Server & AI Tools Hub'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Refresh Tools',
            onPressed: () => ref.invalidate(mcpToolsProvider),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Server status card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E1B4B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.smart_toy_rounded, color: Colors.cyanAccent, size: 22),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'BookMySpace MCP Server (JSON-RPC 2.0)',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Port: 3000 • Gateway: /api/mcp/execute • Active Protocol v1',
                              style: TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'ONLINE',
                          style: TextStyle(
                            color: Colors.greenAccent,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Allows Claude Desktop, Cursor AI, and Gemini Agents to query venue availability, verify slot pricing, and manage holds safely through role-based access control (Section 86).',
                    style: TextStyle(color: Colors.white60, fontSize: 12, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Allowlisted MCP Tools',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),

            toolsAsync.when(
              loading: () => const Center(child: Padding(padding: EdgeInsets.all(24), child: CircularProgressIndicator())),
              error: (e, _) => ErrorView(
                message: e.toString(),
                onRetry: () => ref.invalidate(mcpToolsProvider),
              ),
              data: (tools) => tools.isEmpty
                  ? const EmptyState(
                      icon: Icons.code_rounded,
                      title: 'No Tools Available',
                      message: 'No registered MCP tools found on the backend hub.',
                    )
                  : Column(
                      children: tools.map((t) {
                        final isSelected = _selectedTool == t['name'];
                        final isReadOnly = t['readOnly'] as bool? ?? false;
                        final requiresConfirmation = t['requiresConfirmation'] as bool? ?? false;

                        return Card(
                          margin: const EdgeInsets.only(bottom: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                            side: BorderSide(
                              color: isSelected ? AppTheme.brand : Colors.grey.withValues(alpha: 0.2),
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(14),
                            onTap: () => _onSelectTool(t),
                            child: Padding(
                              padding: const EdgeInsets.all(14),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          t['name'] as String? ?? '',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontFamily: 'monospace',
                                            fontSize: 13,
                                          ),
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: isReadOnly
                                              ? Colors.blue.withValues(alpha: 0.1)
                                              : Colors.amber.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          isReadOnly ? 'READ ONLY' : 'MUTATION',
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.bold,
                                            color: isReadOnly ? Colors.blue.shade800 : Colors.amber.shade900,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    t['description'] as String? ?? '',
                                    style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Text(
                                        'Role: ${t['requiredRole'] ?? 'customer'}',
                                        style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                      ),
                                      if (requiresConfirmation) ...[
                                        const SizedBox(width: 12),
                                        const Icon(Icons.shield_outlined, size: 12, color: Colors.red),
                                        const SizedBox(width: 2),
                                        const Text(
                                          'Confirmation Required',
                                          style: TextStyle(fontSize: 11, color: Colors.red, fontWeight: FontWeight.bold),
                                        ),
                                      ],
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
            ),
            const SizedBox(height: 20),

            // Execution Console
            if (_selectedTool != null) ...[
              const Text(
                'Interactive Tool Execution Console',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Payload Parameters (JSON): $_selectedTool',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      TextField(
                        controller: _inputController,
                        maxLines: 5,
                        style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                        decoration: InputDecoration(
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          filled: true,
                          fillColor: Colors.grey.withValues(alpha: 0.05),
                        ),
                      ),
                      const SizedBox(height: 12),
                      FilledButton.icon(
                        onPressed: _isExecuting
                            ? null
                            : () {
                                final tools = toolsAsync.value ?? [];
                                final tool = tools.firstWhere(
                                  (t) => t['name'] == _selectedTool,
                                  orElse: () => {'name': _selectedTool, 'requiresConfirmation': false},
                                );
                                _executeTool(tool);
                              },
                        icon: _isExecuting
                            ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Icon(Icons.play_arrow_rounded, size: 18),
                        label: Text(_isExecuting ? 'Executing Tool...' : 'Execute via MCP Hub'),
                        style: FilledButton.styleFrom(backgroundColor: AppTheme.brand),
                      ),
                      if (_executionOutput != null) ...[
                        const SizedBox(height: 16),
                        const Text('Execution Response:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        const SizedBox(height: 6),
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            const JsonEncoder.withIndent('  ').convert(_executionOutput),
                            style: const TextStyle(
                              color: Colors.lightGreenAccent,
                              fontFamily: 'monospace',
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
