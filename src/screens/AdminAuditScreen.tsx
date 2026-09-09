import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Filter,
  FileText,
  Lock,
  Layers,
  Search,
} from 'lucide-react';
import { AuditLog } from '../types';

export const AdminAuditScreen: React.FC = () => {
  const {
    venues,
    approveVenue,
    rejectVenue,
    auditLogs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'APPROVALS' | 'AUDIT_LOGS'>('APPROVALS');
  const [rejectModalVenueId, setRejectModalVenueId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Incomplete fire safety certification');
  const [logFilterAction, setLogFilterAction] = useState<string>('ALL');

  // Listings awaiting admin approval
  const pendingVenues = venues.filter((v) => v.status === 'PENDING');

  const filteredLogs =
    logFilterAction === 'ALL'
      ? auditLogs
      : auditLogs.filter((l) => l.action.includes(logFilterAction));

  const handleExecuteReject = () => {
    if (!rejectModalVenueId) return;
    rejectVenue(rejectModalVenueId, rejectReason);
    setRejectModalVenueId(null);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
              Platform Admin Console
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Governance, Approvals & System Audit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict compliance monitoring, listing moderation, and immutable transaction audit trails
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('APPROVALS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeTab === 'APPROVALS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Listing Approvals
            {pendingVenues.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[9px]">
                {pendingVenues.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'AUDIT_LOGS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: LISTING APPROVALS QUEUE */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-4">
          {pendingVenues.length > 0 ? (
            pendingVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <img
                      src={venue.images[0]?.url || venue.featuredImageUrl}
                      alt={venue.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {venue.category.name}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          NEEDS REVIEW
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{venue.name}</h3>
                      <p className="text-xs text-slate-500">{venue.addressLine1}, {venue.city}</p>
                      <div className="text-xs text-slate-700 mt-1">
                        Base: <span className="font-bold">₹{venue.pricingBaseAmount.toLocaleString('en-IN')}</span> • Capacity: <span className="font-bold">{venue.capacity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => approveVenue(venue.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => setRejectModalVenueId(venue.id)}
                      className="px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Reject Listing
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">All submissions reviewed!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                There are currently no new property listings waiting in the admin approval queue.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700">Filter Trail:</div>
            <select
              value={logFilterAction}
              onChange={(e) => setLogFilterAction(e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium"
            >
              <option value="ALL">All Event Types</option>
              <option value="BOOKING">Booking Actions</option>
              <option value="PAYMENT">Payment Events</option>
              <option value="HOLD">Concurrency Holds</option>
              <option value="VENUE">Venue Moderation</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
            {filteredLogs.map((log) => {
              const dateStr = new Date(log.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{log.entityId}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <p className="text-slate-800 font-medium">{log.details}</p>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
                    <span>Actor: <span className="font-semibold text-slate-600">{log.actorName} ({log.actorRole})</span></span>
                    <span>•</span>
                    <span>Entity: {log.entityType}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalVenueId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
              Provide Rejection Reason
            </h3>
            <p className="text-xs text-slate-500">
              This message will be sent to the host explaining what verification documents need to be uploaded.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectModalVenueId(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Send Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
