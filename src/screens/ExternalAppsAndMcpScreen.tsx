import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe,
  Bot,
  Key,
  Webhook,
  Calendar,
  Share2,
  Copy,
  Check,
  Play,
  Plus,
  Trash2,
  Code2,
  Sparkles,
  Layers,
  Terminal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { SAMPLE_CUSTOM_SITES, SAMPLE_MCP_TOOLS } from '../data/mockData';

export const ExternalAppsAndMcpScreen: React.FC = () => {
  const { venues, bookings } = useApp();

  const [activeTab, setActiveTab] = useState<'sites' | 'mcp' | 'api' | 'webhooks' | 'apps'>('mcp');

  // Sites State
  const [sites, setSites] = useState(SAMPLE_CUSTOM_SITES);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteDomain, setNewSiteDomain] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // MCP Tester State
  const [selectedTool, setSelectedTool] = useState(SAMPLE_MCP_TOOLS[0]);
  const [mcpInputJson, setMcpInputJson] = useState('{\n  "venueId": "v_grand_palace",\n  "date": "2026-10-15",\n  "slotKey": "morning"\n}');
  const [mcpOutput, setMcpOutput] = useState<string | null>(null);
  const [isExecutingMcp, setIsExecutingMcp] = useState(false);

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_live_1', name: 'Production Booking Widget', prefix: 'bms_live_4918...', scopes: ['read:venues', 'write:bookings'], created: '2026-08-10' },
    { id: 'key_test_2', name: 'Sandbox Development Test', prefix: 'bms_test_8812...', scopes: ['read:venues', 'manage:holds'], created: '2026-09-01' },
  ]);

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState('https://concierge.partnerdomain.com/bms/webhooks');
  const [webhookEvents, setWebhookEvents] = useState(['BOOKING_CONFIRMED', 'HOLD_RELEASED', 'PAYMENT_CAPTURED']);
  const [webhookLog, setWebhookLog] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExecuteMcpTool = () => {
    setIsExecutingMcp(true);
    setTimeout(() => {
      if (selectedTool.name === 'check_slot_availability') {
        setMcpOutput(
          JSON.stringify(
            {
              status: 'AVAILABLE',
              venueId: 'v_grand_palace',
              venueName: 'The Royal Imperial Palace & Convention',
              date: '2026-10-15',
              slot: 'Morning Muhurtham (07:00 AM - 02:00 PM)',
              isLockedByHold: false,
              pricing: { baseAmount: 185000, taxGst: 33300, total: 218300 },
              concurrencyId: 'MUTEX_V_GRAND_PALACE_2026-10-15_AM',
            },
            null,
            2
          )
        );
      } else if (selectedTool.name === 'create_temporary_hold') {
        setMcpOutput(
          JSON.stringify(
            {
              holdId: `HOLD-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'HELD',
              expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
              durationMinutes: 10,
              message: 'Atomic inventory mutex acquired. Online & offline walk-in booking locked.',
            },
            null,
            2
          )
        );
      } else {
        setMcpOutput(
          JSON.stringify(
            {
              matchedVenuesCount: venues.length,
              results: venues.slice(0, 2).map((v) => ({
                id: v.id,
                name: v.name,
                city: v.city,
                basePrice: v.pricingBaseAmount,
                rating: v.avgRating,
              })),
            },
            null,
            2
          )
        );
      }
      setIsExecutingMcp(false);
    }, 450);
  };

  const handleTriggerTestWebhook = () => {
    setWebhookLog('Transmitting test payload to webhook URL...');
    setTimeout(() => {
      setWebhookLog(
        `HTTP 200 OK Response received in 118ms\nEvent: BOOKING_CONFIRMED\nPayload: {\n  "bookingId": "BMS-2026-98124",\n  "venue": "Smash Arena",\n  "amount": 716,\n  "qrPassUrl": "https://bookmyspace.app/qr/pass-98124"\n}`
      );
    }, 500);
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
      <div className="border-b border-slate-200 pb-4">
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
          Developer & Partner Ecosystem
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
          <Globe className="w-6 h-6 text-indigo-600" />
          External Apps, Widgets & Model Context Protocol (MCP) Hub
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Embed booking widgets, integrate Claude & Cursor AI agents via MCP, configure REST webhooks, and sync calendars.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold overflow-x-auto pb-1">
        {[
          { key: 'mcp', label: 'MCP & AI Agents', icon: Bot },
          { key: 'sites', label: 'Universal Sites & Widgets', icon: Globe },
          { key: 'api', label: 'REST API & Secret Keys', icon: Key },
          { key: 'webhooks', label: 'Webhooks & Events', icon: Webhook },
          { key: 'apps', label: 'Connected Apps (Google / WhatsApp)', icon: Calendar },
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
                  Select MCP Tool to Test
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
                      } else {
                        setMcpInputJson('{\n  "city": "Hyderabad",\n  "category": "sports_turf"\n}');
                      }
                      setMcpOutput(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all truncate ${
                      selectedTool.name === tool.name
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-1">Tool Description:</span>
                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedTool.description}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Input Arguments (JSON):</label>
                <textarea
                  rows={4}
                  value={mcpInputJson}
                  onChange={(e) => setMcpInputJson(e.target.value)}
                  className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 focus:outline-hidden"
                />
              </div>

              <button
                disabled={isExecutingMcp}
                onClick={handleExecuteMcpTool}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isExecutingMcp ? 'Executing Tool...' : 'Execute Tool via MCP Handler'}</span>
              </button>
            </div>

            {/* Right: Output Payload View */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-mono text-sky-400">Response Payload (JSON)</span>
                  <span className="text-[10px] font-mono text-slate-400">Model Context Protocol v1.0</span>
                </div>

                {mcpOutput ? (
                  <pre className="font-mono text-xs text-emerald-300 overflow-x-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    {mcpOutput}
                  </pre>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-500 text-xs font-mono">
                    Click "Execute Tool" to inspect response structure.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Protocol: Streamable Stdout/SSE</span>
                <span className="text-emerald-400">Ready for Agent Integration</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Universal Sites & Widgets */}
      {activeTab === 'sites' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">Connected Partner Websites</h3>
            <div className="divide-y divide-slate-100">
              {sites.map((site) => (
                <div key={site.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{site.siteName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                        {site.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">{site.domain} • Embed Mode: {site.embedType}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `<iframe src="https://bookmyspace.app/embed/widget?partnerKey=${site.apiKey}" width="100%" height="650" frameborder="0"></iframe>`,
                          site.id
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                    >
                      {copiedKey === site.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Code2 className="w-3.5 h-3.5" />}
                      <span>{copiedKey === site.id ? 'Copied HTML!' : 'Copy Embed Code'}</span>
                    </button>
                  </div>
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

      {/* Tab 5: Connected Apps */}
      {activeTab === 'apps' && (
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
      )}
    </div>
  );
};
