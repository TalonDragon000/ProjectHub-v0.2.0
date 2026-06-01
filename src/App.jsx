import React, { lazy, Suspense } from 'react';
import { useApp } from './context/AppContext.jsx';

import AppHeader from './components/AppHeader.jsx';
import BottomNav from './components/BottomNav.jsx';
import GlobalMenu from './components/GlobalMenu.jsx';
import GoalToast from './components/GoalToast.jsx';

import HomeDashboard from './views/HomeDashboard.jsx';
import TasksWorkspace from './views/TasksWorkspace.jsx';

// OnboardingModal is eager — it is the first screen new users see.
import OnboardingModal from './components/modals/OnboardingModal.jsx';

// All other modals are lazy — they are only needed after the user interacts.
const PriorityWizard   = lazy(() => import('./components/modals/PriorityWizard.jsx'));
const QuickNoteModal   = lazy(() => import('./components/modals/QuickNoteModal.jsx'));
const VaultModal       = lazy(() => import('./components/modals/VaultModal.jsx'));
const TaskViewModal    = lazy(() => import('./components/modals/TaskViewModal.jsx'));
const ProjectEditModal = lazy(() => import('./components/modals/ProjectEditModal.jsx'));

export default function App() {
  const { activeTab, handleTouchStart, handleTouchEnd } = useApp();

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-base text-primary flex flex-col font-sans relative overflow-hidden select-none">

      <AppHeader />

      <main
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'tasks' && <TasksWorkspace />}
      </main>

      <BottomNav />
      <GlobalMenu />

      <OnboardingModal />

      <Suspense fallback={null}>
        <QuickNoteModal />
        <VaultModal />
        <PriorityWizard />
        <TaskViewModal />
        <ProjectEditModal />
      </Suspense>

      <GoalToast />

    </div>
  );
}
