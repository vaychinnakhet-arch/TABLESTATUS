import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Layers, PieChart, AlertTriangle } from 'lucide-react';
import { ProjectData, UnitData, TaskDefinition } from '../types';
import { CONFIG, TASK_DEFINITIONS } from '../constants';
import UpdateModal from './Modals/UpdateModal';
import clsx from 'clsx';

interface DashboardProps {
  projectData: ProjectData;
  viewType: 'residential' | 'common' | 'qcSummary';
  setViewType: (view: 'residential' | 'common' | 'qcSummary') => void;
  onBack: () => void;
  onUpdateData: (data: ProjectData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projectData, viewType, setViewType, onBack, onUpdateData }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('skimAndPaint');
  const [selectedCell, setSelectedCell] = useState<{ floor: number, room: number, category: string, unitData: UnitData } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCellClick = (floor: number, room: number, category: string) => {
    const unitData = projectData[category]?.[floor]?.[room] || {};
    setSelectedCell({ floor, room, category, unitData });
    setIsModalOpen(true);
  };

  const handleSaveUpdate = (newData: UnitData) => {
    if (!selectedCell) return;
    const { floor, room, category } = selectedCell;
    
    const updatedProjectData = { ...projectData };
    if (!updatedProjectData[category]) updatedProjectData[category] = {};
    if (!updatedProjectData[category][floor]) updatedProjectData[category][floor] = {};
    updatedProjectData[category][floor][room] = newData;

    onUpdateData(updatedProjectData);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-800 hidden md:block">Vay Chinnakhet</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewType('residential')}
            className={clsx("px-3 py-1.5 rounded-md text-sm font-medium transition-all", viewType === 'residential' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            ห้องพัก
          </button>
          <button 
            onClick={() => setViewType('qcSummary')}
            className={clsx("px-3 py-1.5 rounded-md text-sm font-medium transition-all", viewType === 'qcSummary' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            สรุป QC
          </button>
          <button 
            onClick={() => setViewType('common')}
            className={clsx("px-3 py-1.5 rounded-md text-sm font-medium transition-all", viewType === 'common' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            ส่วนกลาง
          </button>
        </div>

        <div className="text-xs text-slate-400 hidden md:block">
          Last update: {new Date().toLocaleTimeString()}
        </div>
      </header>

      {/* Controls */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center gap-4 shadow-sm z-0">
        {viewType === 'residential' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">เลือกงาน:</span>
            <select 
              value={currentCategory} 
              onChange={(e) => setCurrentCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
            >
              {Object.entries(TASK_DEFINITIONS).map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="ml-auto flex gap-2">
           <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
             <Download size={16} /> Export
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-w-max">
          <div className="overflow-x-auto">
            {viewType === 'residential' && (
              <ResidentialTable 
                projectData={projectData} 
                category={currentCategory} 
                onCellClick={handleCellClick} 
              />
            )}
            {viewType === 'common' && (
              <CommonAreaTable projectData={projectData} />
            )}
            {viewType === 'qcSummary' && (
              <QCSummaryTable projectData={projectData} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCell && (
        <UpdateModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveUpdate}
          taskDef={TASK_DEFINITIONS[selectedCell.category]}
          initialData={selectedCell.unitData}
          title={`${TASK_DEFINITIONS[selectedCell.category].name} - ชั้น ${selectedCell.floor} ห้อง ${selectedCell.room}`}
        />
      )}
    </div>
  );
};

const ResidentialTable = ({ projectData, category, onCellClick }: { projectData: ProjectData, category: string, onCellClick: (f: number, r: number, c: string) => void }) => {
  const taskDef = TASK_DEFINITIONS[category];
  
  return (
    <table className="w-full text-sm text-center border-collapse">
      <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 shadow-sm">
        <tr>
          <th className="p-3 border border-slate-200 min-w-[60px] bg-slate-100 sticky left-0 z-20">ชั้น</th>
          {Array.from({ length: CONFIG.ROOMS_PER_FLOOR }, (_, i) => i + 1).map(room => (
            <th key={room} className="p-3 border border-slate-200 min-w-[50px]">{room}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {CONFIG.FLOORS.map((floor, index) => (
          <motion.tr 
            key={floor} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="hover:bg-slate-50 transition-colors"
          >
            <td className="p-3 border border-slate-200 font-bold bg-slate-50 sticky left-0 z-10">{floor}</td>
            {Array.from({ length: CONFIG.ROOMS_PER_FLOOR }, (_, i) => i + 1).map(room => {
              if (floor === 2 && room > CONFIG.ROOMS_ON_FLOOR_2) {
                return <td key={room} className="p-3 border border-slate-200 bg-slate-100"></td>;
              }
              
              const unitData = projectData[category]?.[floor]?.[room] || {};
              return (
                <td 
                  key={room} 
                  onClick={() => onCellClick(floor, room, category)}
                  className="p-1 border border-slate-200 cursor-pointer relative h-12 min-w-[50px]"
                >
                  <CellContent unitData={unitData} taskDef={taskDef} />
                </td>
              );
            })}
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
};

const CellContent = ({ unitData, taskDef }: { unitData: UnitData, taskDef: TaskDefinition }) => {
  if (taskDef.type === 'progress') {
    const progress = unitData.progress || 0;
    const isComplete = progress >= 100;
    const colorClass = isComplete ? 'bg-emerald-500 text-white' : (progress > 0 ? 'bg-sky-100 text-sky-800' : '');
    
    return (
      <div className={`w-full h-full flex items-center justify-center rounded ${colorClass} transition-all duration-200`}>
        {progress > 0 && <span className="font-medium text-xs">{progress}%</span>}
      </div>
    );
  }
  
  if (taskDef.type === 'multi-progress') {
    const totalProgress = taskDef.tasks.reduce((acc, task) => acc + (unitData[`progress_${task.key}` as keyof UnitData] as number || 0), 0);
    const avg = totalProgress / taskDef.tasks.length;
    const isComplete = avg >= 99; // Tolerance for floating point
    const colorClass = isComplete ? 'bg-emerald-500 text-white' : (avg > 0 ? 'bg-indigo-100 text-indigo-800' : '');

    return (
      <div className={`w-full h-full flex flex-col items-center justify-center rounded ${colorClass} transition-all duration-200`}>
        {avg > 0 && <span className="font-bold text-xs">{Math.round(avg)}%</span>}
      </div>
    );
  }

  if (taskDef.type === 'inspection') {
    if (unitData.inInspection) return <div className="w-full h-full bg-yellow-100 flex items-center justify-center rounded border border-yellow-200"><AlertTriangle size={14} className="text-yellow-600" /></div>;
    
    const score = unitData.qcScore || unitData.cmScore || 0;
    if (score === 0) return null;
    
    const isPass = score >= 85;
    const colorClass = isPass ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
    
    return (
      <div className={`w-full h-full flex items-center justify-center rounded ${colorClass} transition-all duration-200`}>
        <span className="font-bold text-xs">{score}</span>
      </div>
    );
  }

  return null;
};

const CommonAreaTable = ({ projectData }: { projectData: ProjectData }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
      <div className="bg-slate-100 p-6 rounded-full mb-4">
        <Layers size={48} className="opacity-50" />
      </div>
      <h3 className="text-lg font-medium text-slate-600 mb-2">Common Area View</h3>
      <p>This view is under construction.</p>
    </div>
  );
};

const QCSummaryTable = ({ projectData }: { projectData: ProjectData }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
      <div className="bg-slate-100 p-6 rounded-full mb-4">
        <PieChart size={48} className="opacity-50" />
      </div>
      <h3 className="text-lg font-medium text-slate-600 mb-2">QC Summary View</h3>
      <p>This view is under construction.</p>
    </div>
  );
};

export default Dashboard;
