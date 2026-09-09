import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sliders,
  Settings,
} from 'lucide-react';

export const AdminSectionsScreen: React.FC = () => {
  const { featureToggles, toggleFeature } = useApp();

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
          Platform Configuration
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-600" />
          Plug & Play Features & Section Toggles
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Enable or disable core modules, payment rules, and concurrency engines in real-time
        </p>
      </div>

      {/* Feature Toggles List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {featureToggles.map((feature) => (
          <div
            key={feature.key}
            className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{feature.title}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                  {feature.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">{feature.description}</p>
            </div>

            <button
              onClick={() => toggleFeature(feature.key)}
              className="text-indigo-600 focus:outline-hidden p-1 shrink-0"
              title="Toggle Feature"
            >
              {feature.isEnabled ? (
                <ToggleRight className="w-10 h-10 text-indigo-600 fill-indigo-100" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-slate-300" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Dynamic Registration Fields Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-600" />
          Category-Specific Dynamic Fields Configuration
        </h3>
        <p className="text-xs text-slate-500">
          Fields shown during venue onboarding automatically adjust based on space category:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Wedding & Banquet Halls</span>
            <p className="text-[11px] text-slate-500">• Muhurtham Slot timings</p>
            <p className="text-[11px] text-slate-500">• Valet Parking Count</p>
            <p className="text-[11px] text-slate-500">• Veg / Non-Veg plate pricing</p>
            <p className="text-[11px] text-slate-500">• Generator fuel backup</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Sports Courts & Turfs</span>
            <p className="text-[11px] text-slate-500">• Hourly court block rate</p>
            <p className="text-[11px] text-slate-500">• Non-marking shoe policy</p>
            <p className="text-[11px] text-slate-500">• Equipment rental addons</p>
            <p className="text-[11px] text-slate-500">• BWF synthetic floor tag</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">PG & Co-Living Hostels</span>
            <p className="text-[11px] text-slate-500">• Monthly sharing rent matrix</p>
            <p className="text-[11px] text-slate-500">• Daily 3-meal menu plan</p>
            <p className="text-[11px] text-slate-500">• Biometric gate lock time</p>
            <p className="text-[11px] text-slate-500">• Security deposit months</p>
          </div>
        </div>
      </div>
    </div>
  );
};
