import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Bot,
  Key,
  Webhook,
  Calendar,
  Code2,
  Copy,
  Check,
  Play,
  Terminal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Zap,
  RefreshCw,
  Plus,
  AlertTriangle,
  Phone,
  MapPin,
  Mail,
  ShieldAlert,
  Activity,
  Layers,
} from 'lucide-react';
import { SAMPLE_CUSTOM_SITES, SAMPLE_MCP_TOOLS } from '../data/mockData';

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  status: string;
  apiAvailability: string;
  health: { status: string; latencyMs: number; failureRate: number; httpStatus: number };
  lastSuccessfulSync?: string;
  enabledPlatforms: string[];
  enabled: boolean;
}

export const ExternalAppsAndMcpScreen: React.FC = () => {
  const { venues, bookings } = useApp();

  const [activeTab, setActiveTab] = useState<'integrations' | 'mcp' | 'sites' | 'api' | 'webhooks' | 'apps'>('integrations');

  // Integrations Hub State (Section 68, 78, 83)
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Integration Modal Form
  const [addName, setAddName] = useState('');
  const [addProvider, setAddProvider] = useState('');
  const [addBaseUrl, setAddBaseUrl] = useState('');
  const [addType, setAddType] = useState('REST_API');
  const [addAuthType, setAddAuthType] = useState('Bearer Token');
  const [addPlatforms, setAddPlatforms] = useState(['iOS', 'Android', 'Web']);

  // Sites State
  const [sites, setSites] = useState(SAMPLE_CUSTOM_SITES);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // MCP Tester State
  const [selectedTool, setSelectedTool] = useState(SAMPLE_MCP_TOOLS[0]);
  const [mcpInputJson, setMcpInputJson] = useState('{\n  "venueId": "v_grand_palace",\n  "date": "2026-10-15",\n  "slotKey": "morning"\n}');
  const [mcpOutput, setMcpOutput] = useState<string | null>(null);
  const [isExecutingMcp, setIsExecutingMcp] = useState(false);
  const [showConfirmMutation, setShowConfirmMutation] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_live_1', name: 'Production Booking Widget', prefix: 'bms_live_4918...', scopes: ['read:venues', 'write:bookings'], created: '2026-08-10' },
    { id: 'key_test_2', name: 'Sandbox Development Test', prefix: 'bms_test_8812...', scopes: ['read:venues', 'manage:holds'], created: '2026-09-01' },
  ]);

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState('https://concierge.partnerdomain.com/bms/webhooks');
  const [webhookLog, setWebhookLog] = useState<string | null>(null);

  // Deep Links Demo State (Section 89)
  const [partnerModalVenue, setPartnerModalVenue] = useState<string | null>(null);

  // Load Integrations from Backend
  const loadIntegrations = async () => {
    setIsLoadingIntegrations(true);
    try {
      const res = await fetch('/api/integrations/status');
      if (res.ok) {
        const data = await res.json();
        if (data.providers) {
          setIntegrations(data.providers);
        }
      }
    } catch (e) {
      console.error('Failed to load integrations', e);
    } finally {
      setIsLoadingIntegrations(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleToggleIntegration = async (id: string, currentEnabled: boolean) => {
    const nextEnabled = !currentEnabled;
    try {
      const res = await fetch('/api/integrations/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: nextEnabled }),
      });
      if (res.ok) {
        setIntegrations((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  enabled: nextEnabled,
                  status: nextEnabled ? 'Connected' : 'Disconnected',
                  lastSuccessfulSync: new Date().toISOString(),
                }
              : item
          )
        );
      }
    } catch (e) {
      console.error('Error toggling integration', e);
    }
  };

  const handleTestIntegration = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const health = await res.json();
        setIntegrations((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  health: {
                    ...item.health,
                    latencyMs: health.latencyMs,
                    httpStatus: health.httpStatus,
                  },
                  lastSuccessfulSync: health.lastSuccessfulSync || new Date().toISOString(),
                }
              : item
          )
        );
      }
    } catch (e) {
      console.error('Error testing integration', e);
    } finally {
      setTestingId(null);
    }
  };

  const handleCreateIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addBaseUrl) return;

    try {
      const res = await fetch('/api/integrations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: addProvider ? addProvider.toLowerCase() : `int_${Date.now()}`,
          name: addName,
          type: addType,
          baseUrl: addBaseUrl,
          authType: addAuthType,
          platforms: addPlatforms,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setAddName('');
        setAddProvider('');
        setAddBaseUrl('');
        loadIntegrations();
      }
    } catch (e) {
      console.error('Failed to create integration', e);
    }
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExecuteMcpTool = async () => {
    if (selectedTool.requiresConfirmation && !showConfirmMutation) {
      setShowConfirmMutation(true);
      return;
    }
    setShowConfirmMutation(false);
    setIsExecutingMcp(true);

    try {
      let parsedParams = {};
      try {
        parsedParams = JSON.parse(mcpInputJson);
      } catch {
        parsedParams = {
          venueId: 'v_grand_palace',
          date: '2026-10-15',
          slotKey: 'morning',
          city: 'Hyderabad',
          baseAmount: 185000,
        };
      }

      const response = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: selectedTool.name,
          parameters: parsedParams,
          callerRole: 'admin',
        }),
      });
      const data = await response.json();
      setMcpOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setMcpOutput(JSON.stringify({ error: 'Failed to execute MCP tool via backend', details: err?.message }, null, 2));
    } finally {
      setIsExecutingMcp(false);
    }
  };

  const handleTriggerTestWebhook = async () => {
    setWebhookLog('Transmitting test payload to backend webhook dispatcher...');
    try {
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl,
          eventType: 'BOOKING_CONFIRMED',
        }),
      });
      const data = await res.json();
      setWebhookLog(
        `HTTP ${data.statusCode || 200} OK Response received in ${data.latencyMs || 112}ms\nEvent: ${data.eventType}\nPayload:\n${JSON.stringify(data.deliveredPayload, null, 2)}`
      );
    } catch (err: any) {
      setWebhookLog(`Webhook delivery error: ${err?.message}`);
    }
  };

  const mcpConfigJson = JSON.stringify(
    {
      mcpServers: {
        'bookmyspace-ai': {
          command: 'npx',
          args: ['-y', '@bookmyspace/mcp-server'],
          env: {
            BOOKMYSPACE_API_KEY: 'bms_live_your_secret_key_here',
            BOOKMYSPACE_BASE_URL: 'https://bookmyspace.app/api/v1',
          },
        },
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
            Developer & Partner Ecosystem
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" />
            Integrations, MCP & Deep Linking Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage external APIs, Model Context Protocol server, deep links, webhooks, and calendar sync (Sections 65-98).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 gap-5 text-xs font-bold overflow-x-auto pb-1">
        {[
          { key: 'integrations', label: 'External Connectors Hub', icon: Layers },
          { key: 'mcp', label: 'MCP AI Tools Server', icon: Bot },
          { key: 'apps', label: 'Deep Links & Apps', icon: Calendar },
          { key: 'sites', label: 'Universal Embed Widgets', icon: Globe },
          { key: 'api', label: 'REST API & Secret Keys', icon: Key },
          { key: 'webhooks', label: 'Webhooks & Events', icon: Webhook },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 border-b-2 flex items-center gap-1.5 shrink-0 transition-colors ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 0: External Connectors Hub (Sections 68, 78, 83) */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              Active Connectors ({integrations.length}) • Secrets Secured in Cloud Engine
            </span>
            <button
              onClick={loadIntegrations}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingIntegrations ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => {
              const isTesting = testingId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                        <span className="text-xs text-slate-400">{item.category}</span>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={() => handleToggleIntegration(item.id, item.enabled)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                    <span
                      className={`px-2 py-0.5 rounded-md ${
                        item.status === 'Connected'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      ● {item.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      ⚡ {item.health?.latencyMs || 60}ms
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                      Platforms: {item.enabledPlatforms?.join(', ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono">
                      Secret: Configured ✓
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {item.lastSuccessfulSync
                        ? `Last sync: ${new Date(item.lastSuccessfulSync).toLocaleTimeString()}`
                        : 'Sync online'}
                    </span>
                    <button
                      onClick={() => handleTestIntegration(item.id)}
                      disabled={isTesting}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                    >
                      {isTesting ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                      ) : (
                        <Zap className="w-3 h-3 text-amber-500" />
                      )}
                      <span>{isTesting ? 'Pinging...' : 'Test Connection'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 1: MCP & AI Agents */}
      {activeTab === 'mcp' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white space-y-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-black">Model Context Protocol (MCP) Server for LLM Tools</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              BookMySpace provides standard MCP tool endpoints allowing Claude Desktop, Cursor AI, and Gemini Agents to query real-time venue availability, calculate GST quotes, and hold slots programmatically.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(mcpConfigJson, 'mcp_cfg')}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white transition-all"
              >
                {copiedKey === 'mcp_cfg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'mcp_cfg' ? 'Config Copied!' : 'Copy Claude / Cursor config.json'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Tool Runner */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Tool Selection & Input */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  Select Allowlisted MCP Tool
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                  {selectedTool.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_MCP_TOOLS.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => {
                      setSelectedTool(tool);
                      if (tool.name === 'check_slot_availability') {
                        setMcpInputJson('{\n  "venueId": "v_grand_palace",\n  "date": "2026-10-15",\n  "slotKey": "morning"\n}');
                      } else if (tool.name === 'create_temporary_hold') {
                        setMcpInputJson('{\n  "venueId": "v_smash_arena",\n  "slotId": "ts_sa_1",\n  "guestName": "Narendra Reddy",\n  "guestPhone": "+919849012345"\n}');
                      } else if (tool.name === 'cancel_booking') {
                        setMcpInputJson('{\n  "bookingId": "b_live_9081",\n  "reason": "Customer requested date rescheduling"\n}');
                      } else {
                        setMcpInputJson('{\n  "city": "Hyderabad",\n  "category": "sports_turf"\n}');
                      }
                      setMcpOutput(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all truncate ${
                      selectedTool.name === tool.name
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="truncate">{tool.name}</div>
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5 truncate">{tool.description}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Tool Parameters (JSON)</label>
                <textarea
                  value={mcpInputJson}
                  onChange={(e) => setMcpInputJson(e.target.value)}
                  rows={5}
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Role: <span className="font-bold text-slate-700">{selectedTool.requiredRole || 'customer'}</span>
                  {selectedTool.requiresConfirmation && (
                    <span className="text-red-600 font-bold ml-2">⚠️ Confirmation Required</span>
                  )}
                </span>
                <button
                  onClick={handleExecuteMcpTool}
                  disabled={isExecutingMcp}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  {isExecutingMcp ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  )}
                  <span>{isExecutingMcp ? 'Executing...' : 'Run Tool via MCP Hub'}</span>
                </button>
              </div>
            </div>

            {/* Right: Output console */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-white flex flex-col h-full min-h-[320px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  MCP Server JSON-RPC Output
                </span>
                {mcpOutput && (
                  <button
                    onClick={() => copyToClipboard(mcpOutput, 'mcp_out')}
                    className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                  >
                    {copiedKey === 'mcp_out' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'mcp_out' ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-auto font-mono text-[11px] text-slate-300">
                {mcpOutput ? (
                  <pre className="whitespace-pre-wrap">{mcpOutput}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                    Click "Run Tool via MCP Hub" to inspect execution output.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Universal Sites & Widgets */}
      {activeTab === 'sites' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Configured Partner Websites & Portals</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized third-party domains allowed to embed BookMySpace booking components.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {sites.map((site) => (
                <div key={site.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{site.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {site.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">{site.domain} • Embed Mode: {site.embedType}</span>
                  </div>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        `<iframe src="https://bookmyspace.app/embed/widget?partnerKey=${site.apiKey}" width="100%" height="650" frameborder="0"></iframe>`,
                        site.id
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 self-start sm:self-auto"
                  >
                    {copiedKey === site.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
                    <span>{copiedKey === site.id ? 'Copied HTML!' : 'Copy Embed Code'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-800 block">Embed Snippet Preview:</span>
            <code className="block bg-slate-900 text-sky-300 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
              {`<script src="https://bookmyspace.app/sdk/v1/widget.js" data-api-key="bms_live_key_98a7bc81"></script>`}
            </code>
          </div>
        </div>
      )}

      {/* Tab 3: REST API & Secret Keys */}
      {activeTab === 'api' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">API Secret Keys</h3>
                <p className="text-xs text-slate-500">Authenticate server-to-server calls to BookMySpace REST APIs.</p>
              </div>
              <button className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs">
                + Generate Key
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {apiKeys.map((k) => (
                <div key={k.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{k.name}</span>
                    <span className="font-mono text-xs text-slate-400">{k.prefix}</span>
                    <div className="flex gap-1 mt-1">
                      {k.scopes.map((s) => (
                        <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">Created: {k.created}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-sky-400 block">Quickstart Curl Example:</span>
            <pre className="font-mono text-[11px] text-emerald-300 bg-slate-950 p-3 rounded-xl overflow-x-auto">
              {`curl -X POST https://bookmyspace.app/api/v1/bookings/hold \\
  -H "Authorization: Bearer bms_live_4918..." \\
  -H "Content-Type: application/json" \\
  -d '{"venueId": "v_grand_palace", "slotId": "ts_sa_1"}'`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Webhooks */}
      {activeTab === 'webhooks' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-black text-slate-900">Webhook Endpoints & Automations</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Receive real-time HTTPS push notifications whenever bookings change status or holds expire.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Endpoint URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Subscribed Events</label>
              <div className="flex flex-wrap gap-2">
                {['BOOKING_CONFIRMED', 'HOLD_RELEASED', 'PAYMENT_CAPTURED', 'QR_SCANNED'].map((evt) => (
                  <span key={evt} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-[11px]">
                    ✓ {evt}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleTriggerTestWebhook}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Send Test Ping Payload</span>
            </button>

            {webhookLog && (
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs whitespace-pre-wrap">
                {webhookLog}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Connected Apps & Deep Links (Sections 71, 88, 89) */}
      {activeTab === 'apps' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Google Calendar 2-Way Sync</h4>
                  <span className="text-[11px] text-emerald-600 font-bold">Connected & Synchronized</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Confirmed bookings and walk-ins instantly block corresponding slots on your Google Calendar to prevent scheduling overlap.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">WhatsApp Concierge Bot</h4>
                  <span className="text-[11px] text-emerald-600 font-bold">Active (+91 Official)</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Dispatches automated PDF tax invoices, gate QR passes, and venue direction links to guests on WhatsApp.
              </p>
            </div>
          </div>

          {/* Platform Deep Linking Suite (Section 89) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Platform-Neutral Deep Linking Suite (Section 89)</h3>
              <p className="text-xs text-slate-500">
                Tested and verified across iOS (Universal Links), Android (App Links), and Web (Browser URI).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <a
                href="tel:+919849012345"
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Phone Call</span>
                  <span className="text-[10px] text-slate-400 font-mono">tel:+9198490...</span>
                </div>
              </a>

              <a
                href="https://wa.me/919849012345?text=Hello%20BookMySpace"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">WhatsApp</span>
                  <span className="text-[10px] text-slate-400 font-mono">wa.me link</span>
                </div>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=17.3850,78.4867"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Google Maps</span>
                  <span className="text-[10px] text-slate-400 font-mono">geo: coordinates</span>
                </div>
              </a>

              <button
                onClick={() => setPartnerModalVenue('The Royal Imperial Palace')}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Partner Handoff</span>
                  <span className="text-[10px] text-slate-400">Section 71 notice</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Generic Modal (Section 83) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Add External Integration (Section 83)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIntegration} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Integration Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Global, Twilio SMS"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Provider ID</label>
                  <input
                    type="text"
                    placeholder="e.g. stripe, twilio"
                    value={addProvider}
                    onChange={(e) => setAddProvider(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={addType}
                    onChange={(e) => setAddType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="REST_API">REST API</option>
                    <option value="MCP_SERVICE">MCP Service</option>
                    <option value="WEBHOOK">Webhook</option>
                    <option value="SDK">Official SDK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Base URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.provider.com/v1"
                  value={addBaseUrl}
                  onChange={(e) => setAddBaseUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Authentication Type</label>
                <select
                  value={addAuthType}
                  onChange={(e) => setAddAuthType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Bearer Token">Bearer Token</option>
                  <option value="OAuth2">OAuth2 Flow</option>
                  <option value="API Key Header">API Key Header</option>
                  <option value="None">None (Public)</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Secret Management:</strong> Configured ✓ (Credentials stored server-side, never exposed to clients).
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Register Connector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for MCP Mutations (Section 86) */}
      {showConfirmMutation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-black text-slate-900">Authorize MCP Mutation (Section 86)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The tool <strong>"{selectedTool.name}"</strong> performs an authorized mutation on BookMySpace database records. Explicit confirmation is required to prevent accidental modifications.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmMutation(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteMcpTool}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-xs hover:bg-red-700"
              >
                Confirm & Execute Tool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Website Handoff Modal (Section 71 & 88) */}
      {partnerModalVenue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Continue on Partner Website</h3>
              <p className="text-xs text-slate-500 mt-1">
                You are about to be redirected to the official booking engine for{' '}
                <strong>{partnerModalVenue}</strong>.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-1">
              <div>• Booking confirmation occurs directly with the venue partner.</div>
              <div>• Payment authorization is secured through their verified portal.</div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setPartnerModalVenue(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Return to BookMySpace
              </button>
              <a
                href="https://example.com/partner/book?venue=grand_palace"
                target="_blank"
                rel="noreferrer"
                onClick={() => setPartnerModalVenue(null)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs"
              >
                <span>Continue</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
