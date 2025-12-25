import { useState, useEffect, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { Plus, LayoutGrid, Loader2 } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import FilterBar from '../components/FilterBar';

const Dashboard = () => {
  const { tasks, getTasks, loading } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getTasks();
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchTerm) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter
    if (filter === 'Completed') {
      result = result.filter(t => t.status === 'completed');
    } else if (filter === 'Todo') {
      result = result.filter(t => t.status === 'todo');
    } else if (filter === 'In Progress') {
      result = result.filter(t => t.status === 'in-progress');
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return 0;
    });

    return result;
  }, [tasks, searchTerm, filter, sortBy]);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and track your academic progress</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition duration-200 w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </header>

      <FilterBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="mt-8">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutGrid className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No tasks found</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              {searchTerm || filter !== 'All' 
                ? "Try adjusting your filters to find what you're looking for." 
                : "Ready to get organized? Start by creating your first task."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm task={editingTask} onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default Dashboard;
