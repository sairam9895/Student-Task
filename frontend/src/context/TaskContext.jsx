import { createContext, useState, useContext } from 'react';
import api from '../config/axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await api.get('/api/tasks', config);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await api.post('/api/tasks', taskData, config);
      setTasks([data, ...tasks]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error adding task' };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await api.put(`/api/tasks/${id}`, taskData, config);
      setTasks(tasks.map((t) => (t._id === id ? data : t)));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error updating task' };
    }
  };

  const deleteTask = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await api.delete(`/api/tasks/${id}`, config);
      setTasks(tasks.filter((t) => t._id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error deleting task' };
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, getTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
