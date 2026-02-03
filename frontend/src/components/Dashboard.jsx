import React, { useState, useEffect } from 'react';
import {
    Search, Plus, Calendar, LogOut,
    Sun, Moon, Check, ChevronLeft, ChevronRight
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { getTaskStats } from '../utils/helpers';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import TaskDetail from './TaskDetail';
import LiveClock from './LiveClock';

const Dashboard = ({ user, darkMode, setDarkMode, showNotification }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);

    const tasksPerPage = 9;

    useEffect(() => { fetchTasks(); }, []);
    useEffect(() => { applyFilters(); }, [searchQuery, priorityFilter, statusFilter, tasks]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await taskService.getAllTasks();
            let taskList = [];

            if (response && response.content) {
                taskList = Array.isArray(response.content) ? response.content : [];
            } else if (Array.isArray(response)) {
                taskList = response;
            }
            setTasks(taskList);
        } catch {
            showNotification('Failed to fetch tasks', 'error');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = [...tasks];

        if (searchQuery.trim()) {
            result = result.filter(task =>
                task.taskName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (priorityFilter !== 'ALL') result = result.filter(t => t.priority === priorityFilter);
        if (statusFilter !== 'ALL') result = result.filter(t => t.status === statusFilter);

        setFilteredTasks(result);
        setCurrentPage(1);
    };

    const handleLogout = () => {
        authService.logout();
        window.location.reload();
    };

    const openTaskModal = (task = null) => {
        setSelectedTask(task);
        setShowTaskModal(true);
    };

    const closeTaskModal = () => {
        setShowTaskModal(false);
        setSelectedTask(null);
    };

    const openDetailModal = (task) => {
        setSelectedTask(task);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedTask(null);
    };

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode
                ? 'dark bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#020617]'
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}>

            {/* HEADER */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-black/40 border-b border-gray-200/50 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-5">

                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                                <Check className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Welcome back, {user?.username || 'User'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <LiveClock />

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:scale-105 transition"
                            >
                                {darkMode ? <Sun /> : <Moon />}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-xl bg-red-500/90 hover:bg-red-600 text-white transition"
                            >
                                <LogOut />
                            </button>
                        </div>
                    </div>

                    {/* SEARCH & FILTERS */}
                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="relative flex-1 min-w-[260px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tasks..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border dark:border-white/10"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3.5 rounded-xl bg-white dark:bg-white/5 border dark:border-white/10"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <button
                            onClick={() => openTaskModal()}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow hover:scale-105 transition flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> New Task
                        </button>

                        <button
                            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition flex items-center gap-2"
                        >
                            <Calendar className="w-5 h-5" /> Download Report
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {currentTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => openDetailModal(task)}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-14">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-40"
                        >
                            <ChevronLeft />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                    currentPage === i + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'hover:bg-gray-200 dark:hover:bg-white/10'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-40"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </main>

            {showTaskModal && (
                <TaskModal
                    task={selectedTask}
                    onClose={closeTaskModal}
                    onSuccess={() => {
                        fetchTasks();
                        closeTaskModal();
                    }}
                    showNotification={showNotification}
                />
            )}

            {showDetailModal && selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={closeDetailModal}
                    onEdit={() => {
                        closeDetailModal();
                        openTaskModal(selectedTask);
                    }}
                    onDelete={async () => {
                        await taskService.deleteTask(selectedTask.id);
                        fetchTasks();
                        closeDetailModal();
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
