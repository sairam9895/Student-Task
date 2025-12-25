import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Trash2, Edit2, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const TaskCard = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useTasks();

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 className="text-green-500" size={18} />;
    if (status === 'in-progress') return <Clock className="text-blue-500" size={18} />;
    return <AlertCircle className="text-gray-400" size={18} />;
  };

  const handleToggleStatus = async () => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTask(task._id, { status: nextStatus, completed: nextStatus === 'completed' });
  };

  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
          {(task.priority || '').charAt(0).toUpperCase() + (task.priority || '').slice(1)}
        </span>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-indigo-600 transition">
            <Edit2 size={18} />
          </button>
          <button onClick={() => deleteTask(task._id)} className="text-gray-400 hover:text-red-600 transition">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <h3 className={`text-lg font-bold mb-2 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
        {task.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center text-gray-500 text-xs">
          <Calendar size={14} className="mr-1" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
        <button 
          onClick={handleToggleStatus}
          className="flex items-center space-x-1 text-sm font-medium hover:opacity-80 transition"
        >
          {getStatusIcon(task.status)}
          <span className={task.status === 'completed' ? 'text-green-600' : 'text-gray-600'}>
            {task.status === 'in-progress' ? 'In Progress' : task.status === 'completed' ? 'Completed' : 'Todo'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
