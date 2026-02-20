import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Circle } from 'lucide-react';
import { ProjectData, UnitData, TaskDefinition } from '../types';
import { CONFIG, TASK_DEFINITIONS } from '../constants';
import clsx from 'clsx';

interface QuickUpdateModeProps {
  projectData: ProjectData;
  onBack: () => void;
  onUpdateData: (data: ProjectData) => void;
}

const QuickUpdateMode: React.FC<QuickUpdateModeProps> = ({ projectData, onBack, onUpdateData }) => {
  const [selectedFloor, setSelectedFloor] = useState<number>(CONFIG.FLOORS[0]);
  const [selectedRoom, setSelectedRoom] = useState<number>(1);
  const [view, setView] = useState<'residential' | 'common'>('residential');

  const handleTaskUpdate = (category: string, newData: UnitData) => {
    const updatedProjectData = { ...projectData };
    if (!updatedProjectData[category]) updatedProjectData[category] = {};
    if (!updatedProjectData[category][selectedFloor]) updatedProjectData[category][selectedFloor] = {};
    updatedProjectData[category][selectedFloor][selectedRoom] = newData;
    onUpdateData(updatedProjectData);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f2f2f7] text-[#1c1c1e] font-sans">
      {/* iOS Navigation Bar */}
      <div className="bg-[#f7f7f7]/85 backdrop-blur-xl border-b border-black/10 px-4 py-2 flex items-center justify-between sticky top-0 z-20 h-[60px]">
        <button 
          onClick={onBack}
          className="flex items-center text-[#007aff] font-medium text-lg -ml-2"
        >
          <ChevronLeft size={24} />
          Back
        </button>
        <h1 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">Quick Update</h1>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      {/* Selectors */}
      <div className="px-4 py-3 space-y-4 bg-[#f2f2f7] sticky top-[60px] z-10">
        {/* View Segmented Control */}
        <div className="bg-[#767680]/12 p-0.5 rounded-lg flex">
          <button 
            onClick={() => setView('residential')}
            className={clsx(
              "flex-1 py-1.5 text-sm font-semibold rounded-[7px] transition-all shadow-sm",
              view === 'residential' ? "bg-white text-black shadow" : "text-[#3c3c43]/60 hover:text-black"
            )}
          >
            Residential
          </button>
          <button 
            onClick={() => setView('common')}
            className={clsx(
              "flex-1 py-1.5 text-sm font-semibold rounded-[7px] transition-all",
              view === 'common' ? "bg-white text-black shadow" : "text-[#3c3c43]/60 hover:text-black"
            )}
          >
            Common Area
          </button>
        </div>

        {/* Floor Selector */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
          {CONFIG.FLOORS.map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={clsx(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                selectedFloor === floor 
                  ? "bg-[#007aff] text-white shadow-md" 
                  : "bg-white text-[#007aff] border border-[#007aff]/20"
              )}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* Room Selector */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
          {Array.from({ length: (selectedFloor === 2 ? CONFIG.ROOMS_ON_FLOOR_2 : CONFIG.ROOMS_PER_FLOOR) }, (_, i) => i + 1).map(room => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={clsx(
                "flex-shrink-0 px-4 py-1.5 rounded-full font-medium text-sm transition-all whitespace-nowrap",
                selectedRoom === room 
                  ? "bg-[#007aff] text-white shadow-md" 
                  : "bg-white text-[#007aff] border border-[#007aff]/20"
              )}
            >
              Room {room}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {Object.entries(TASK_DEFINITIONS).map(([key, def], index) => {
            const unitData = projectData[key]?.[selectedFloor]?.[selectedRoom] || {};
            const isLast = index === Object.keys(TASK_DEFINITIONS).length - 1;
            
            return (
              <TaskItem 
                key={key} 
                category={key}
                def={def} 
                unitData={unitData} 
                isLast={isLast}
                onUpdate={(newData) => handleTaskUpdate(key, newData)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TaskItem = ({ category, def, unitData, isLast, onUpdate }: { category: string, def: TaskDefinition, unitData: UnitData, isLast: boolean, onUpdate: (d: UnitData) => void }) => {
  return (
    <div className={clsx("pl-4 pr-4 py-3 flex flex-col gap-2 active:bg-gray-50 transition-colors", !isLast && "border-b border-gray-100")}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-[17px]">{def.name}</span>
        <span className="text-[#3c3c43]/60 text-[15px]">
          {def.type === 'progress' && `${unitData.progress || 0}%`}
          {def.type === 'multi-progress' && `${calculateAvgProgress(def, unitData)}%`}
          {def.type === 'inspection' && (unitData.qcScore ? `${unitData.qcScore}` : (unitData.cmScore ? `${unitData.cmScore} (CM)` : '-'))}
        </span>
      </div>

      {/* Controls */}
      <div className="mt-1">
        {def.type === 'progress' && (
          <div className="flex bg-[#767680]/12 rounded-lg p-0.5">
            {[0, 25, 50, 75, 100].map(val => (
              <button
                key={val}
                onClick={() => onUpdate({ ...unitData, progress: val })}
                className={clsx(
                  "flex-1 py-1 text-xs font-medium rounded-[6px] transition-all",
                  (unitData.progress || 0) === val ? "bg-white text-black shadow-sm" : "text-gray-500"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        )}
        
        {def.type === 'multi-progress' && (
          <div className="grid grid-cols-2 gap-2">
            {def.tasks.map(task => (
              <div key={task.key} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <span className="text-xs font-medium text-gray-600">{task.name}</span>
                <input 
                  type="checkbox"
                  checked={(unitData[`progress_${task.key}` as keyof UnitData] as number) >= 100}
                  onChange={(e) => onUpdate({ ...unitData, [`progress_${task.key}`]: e.target.checked ? 100 : 0 })}
                  className="w-5 h-5 rounded-full text-[#007aff] focus:ring-[#007aff]"
                />
              </div>
            ))}
          </div>
        )}

        {def.type === 'inspection' && (
           <div className="flex gap-2">
             <button 
               onClick={() => onUpdate({ ...unitData, cmScore: 100 })}
               className={clsx("flex-1 py-1.5 text-xs font-medium rounded-lg border", (unitData.cmScore || 0) >= 100 ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-600")}
             >
               CM Pass
             </button>
             <button 
               onClick={() => onUpdate({ ...unitData, qcScore: 100 })}
               className={clsx("flex-1 py-1.5 text-xs font-medium rounded-lg border", (unitData.qcScore || 0) >= 100 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-gray-200 text-gray-600")}
             >
               QC Pass
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

function calculateAvgProgress(def: TaskDefinition, unitData: UnitData) {
  const total = def.tasks.reduce((acc, task) => acc + (unitData[`progress_${task.key}` as keyof UnitData] as number || 0), 0);
  return Math.round(total / def.tasks.length);
}

export default QuickUpdateMode;
