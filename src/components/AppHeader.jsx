import React from 'react';
import { Folder } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function AppHeader() {
  const { activeProject, setVaultOpen } = useApp();

  return (
    <header className="p-4 border-b border-subtle flex justify-between items-center bg-surface z-10">
      <div onClick={() => setVaultOpen(true)} className="cursor-pointer active:opacity-70 flex items-center space-x-2">
        <Folder className="w-5 h-5 text-accent-tertiary" />
        <div>
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary leading-tight">
            {activeProject?.name || "Project Hub"}
          </h1>
          <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Tap to open Vault</p>
        </div>
      </div>
    </header>
  );
}
