import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen, projectForm, setProjectForm, createProject, projects } = useApp();

  if (!onboardingOpen) return null;

  return (
    <div className="absolute inset-0 bg-base z-50 flex flex-col justify-center p-8 animate-in zoom-in-95">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-tertiary-alt to-accent-primary mb-2">
          New Project
        </h2>
        <p className="text-muted text-sm">A 10-second start to maintain focus.</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-faint uppercase tracking-widest ml-1 mb-1 block">Project Name</label>
          <input
            type="text"
            value={projectForm.name}
            onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
            placeholder="e.g. DeFi Wallet"
            className="w-full bg-surface border-b-2 border-default focus:border-accent-tertiary outline-none px-3 py-4 text-xl text-primary rounded-t-xl transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-faint uppercase tracking-widest ml-1 mb-1 block">Core Mission (One sentence)</label>
          <input
            type="text"
            value={projectForm.mission}
            onChange={e => setProjectForm({ ...projectForm, mission: e.target.value })}
            placeholder="Why are we building this?"
            className="w-full bg-surface border-b-2 border-default focus:border-accent-tertiary outline-none px-3 py-4 text-lg text-primary rounded-t-xl transition-colors"
          />
        </div>
        <button
          onClick={createProject}
          className="w-full bg-accent-tertiary text-primary font-bold py-4 rounded-xl mt-8 shadow-tertiary active:scale-95 transition-transform"
        >
          Start Building
        </button>
        {projects.length > 0 && (
          <button onClick={() => setOnboardingOpen(false)} className="w-full text-faint text-sm mt-4 p-2">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
