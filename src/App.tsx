import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { CONFIG } from './constants';
import { ProjectData } from './types';
import { generateInitialDataObject } from './utils/initialData';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import QuickUpdateMode from './components/QuickUpdateMode';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<ProjectData>({});
  const [currentView, setCurrentView] = useState<'splash' | 'dashboard' | 'quickUpdate'>('splash');
  const [dashboardViewType, setDashboardViewType] = useState<'residential' | 'common' | 'qcSummary'>('residential');

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('project-data-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: CONFIG.DB_TABLE_NAME, filter: `id=eq.${CONFIG.DB_ROW_ID}` },
        (payload) => {
          console.log('Realtime update received!', payload);
          setProjectData(payload.new.data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(CONFIG.DB_TABLE_NAME)
      .select('data')
      .eq('id', CONFIG.DB_ROW_ID)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching data:', error);
    } else if (data) {
      setProjectData(data.data);
    } else {
      // No data found, create initial data
      console.log("No data in Supabase, creating initial document...");
      const initialData = generateInitialDataObject();
      setProjectData(initialData);
      
      const { error: insertError } = await supabase
        .from(CONFIG.DB_TABLE_NAME)
        .insert({ id: CONFIG.DB_ROW_ID, data: initialData });
      
      if (insertError) {
        console.error('Error creating initial document:', insertError);
      }
    }
    setLoading(false);
  };

  const updateProjectData = async (newData: ProjectData) => {
    // Optimistic update
    setProjectData(newData);
    
    const { error } = await supabase
      .from(CONFIG.DB_TABLE_NAME)
      .update({ data: newData })
      .eq('id', CONFIG.DB_ROW_ID);

    if (error) {
      console.error('Error updating data:', error);
      // Revert or show error
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AnimatePresence mode="wait">
        {currentView === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <SplashScreen 
              projectData={projectData}
              onNavigate={(view) => {
                if (view === 'quickUpdate') {
                  setCurrentView('quickUpdate');
                } else {
                  setDashboardViewType(view === 'common' ? 'common' : 'residential');
                  setCurrentView('dashboard');
                }
              }}
            />
          </motion.div>
        )}

        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 overflow-auto"
          >
            <Dashboard 
              projectData={projectData} 
              viewType={dashboardViewType}
              setViewType={setDashboardViewType}
              onBack={() => setCurrentView('splash')}
              onUpdateData={updateProjectData}
            />
          </motion.div>
        )}

        {currentView === 'quickUpdate' && (
          <motion.div
            key="quickUpdate"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="absolute inset-0 bg-gray-100"
          >
            <QuickUpdateMode 
              projectData={projectData}
              onBack={() => setCurrentView('splash')}
              onUpdateData={updateProjectData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
