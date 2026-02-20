import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { TaskDefinition, UnitData } from '../../types';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UnitData) => void;
  taskDef: TaskDefinition;
  initialData: UnitData;
  title: string;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, onSave, taskDef, initialData, title }) => {
  const [data, setData] = useState<UnitData>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {taskDef.type === 'progress' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">ความคืบหน้า (%)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="10"
                  value={data.progress || 0} 
                  onChange={(e) => setData({ ...data, progress: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-lg font-bold text-indigo-600 w-12 text-right">{data.progress}%</span>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">ขั้นตอนปัจจุบัน</label>
                <select 
                  value={data.taskIndex || 0} 
                  onChange={(e) => setData({ ...data, taskIndex: parseInt(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {taskDef.tasks.map((task, index) => (
                    <option key={index} value={index}>{task.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {taskDef.type === 'multi-progress' && (
            <div className="space-y-4">
              {taskDef.tasks.map((task) => (
                <div key={task.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{task.name}</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="10"
                      value={data[`progress_${task.key}` as keyof UnitData] as number || 0} 
                      onChange={(e) => setData({ ...data, [`progress_${task.key}`]: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-sm font-bold text-indigo-600 w-10 text-right">
                      {data[`progress_${task.key}` as keyof UnitData] as number || 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {taskDef.type === 'inspection' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="inInspection"
                  checked={data.inInspection || false}
                  onChange={(e) => setData({ ...data, inInspection: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="inInspection" className="text-sm font-medium text-slate-700">อยู่ระหว่างการตรวจสอบ</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">คะแนน CM</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={data.cmScore || 0}
                    onChange={(e) => setData({ ...data, cmScore: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">คะแนน QC</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={data.qcScore || 0}
                    onChange={(e) => setData({ ...data, qcScore: parseFloat(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                 <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={data.cmHasMajorDefect || false}
                      onChange={(e) => setData({ ...data, cmHasMajorDefect: e.target.checked })}
                      className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm text-slate-600">CM Major Defect</span>
                 </label>
                 <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={data.qcHasMajorDefect || false}
                      onChange={(e) => setData({ ...data, qcHasMajorDefect: e.target.checked })}
                      className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm text-slate-600">QC Major Defect</span>
                 </label>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Save size={18} />
            บันทึก
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UpdateModal;
