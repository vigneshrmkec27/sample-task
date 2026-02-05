import React, { useEffect, useCallback, useMemo, useState } from 'react';
import {
    Search, Plus, Calendar, LogOut,
    Check, ChevronLeft, ChevronRight, UserCircle,
    LayoutGrid, List
} from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { getTaskStats } from '../utils/helpers';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import TaskDetail from './TaskDetail';
import LiveClock from './LiveClock';
import CalendarView from './CalendarView';
import ProfilePanel from './ProfilePanel';
import ThemeToggle from './ThemeToggle';

const AnimatedCounter = ({ value }) => {
    const shouldReduceMotion = useReducedMotion();
    const motionValue = useMotionValue(value);
    const spring = useSpring(motionValue, { stiffness: 120, damping: 20 });
    const rounded = useTransform(spring, (latest) => Math.round(latest));

    useEffect(() => {
        motionValue.set(value);
    }, [motionValue, value]);

    if (shouldReduceMotion) {
        return <span>{value}</span>;
    }

    return <motion.span>{rounded}</motion.span>;
};

const TaskCardSkeleton = () => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shimmer">
        <div className="h-1 w-full rounded-full bg-white/10 mb-4" />
        <div className="h-4 w-2/3 rounded-full bg-white/10 mb-3" />
        <div className="h-3 w-full rounded-full bg-white/10 mb-2" />
        <div className="h-3 w-5/6 rounded-full bg-white/10 mb-6" />
        <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="h-6 w-16 rounded-full bg-white/10" />
        </div>
    </div>
);

const Dashboard = ({ user, darkMode, setDarkMode, showNotification, onUserUpdate }) => {
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
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const shouldReduceMotion = useReducedMotion();
    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 300], [0, shouldReduceMotion ? 0 : -40]);

    const tasksPerPage = 9;

    const fetchTasks = useCallback(async () => {
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
    }, [showNotification]);

    const applyFilters = useCallback(() => {
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
    }, [priorityFilter, searchQuery, statusFilter, tasks]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);
    useEffect(() => { applyFilters(); }, [applyFilters]);

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

    const handleProfileSave = async (payload) => {
        setIsSavingProfile(true);
        try {
            const updatedUser = await authService.updateProfile(payload);
            onUserUpdate(updatedUser);
            showNotification('Profile updated successfully.');
            setShowProfilePanel(false);
        } catch (error) {
            showNotification(error.response?.data?.message || error.response?.data || 'Failed to update profile', 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const stats = getTaskStats(tasks);
    const selectedDateKey = selectedDate.toISOString().split('T')[0];
    const tasksForSelectedDate = tasks.filter((task) => task.dueDate === selectedDateKey);
    const sidebarItems = useMemo(
        () => [
            { label: 'Overview', icon: LayoutGrid },
            { label: 'Tasks', icon: List },
            { label: 'Calendar', icon: Calendar },
        ],
        []
    );

    return (
        <div className={`relative min-h-screen transition-colors duration-300 ${
            darkMode
                ? 'dark bg-[#05060b] text-white'
                : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
        }`}>
            <motion.div className="absolute inset-0 aurora-gradient opacity-70" style={{ y: parallaxY }} />
            <div className="noise-layer" />

            <div className="relative z-10 flex min-h-screen">
                <motion.aside
                    className="hidden lg:flex flex-col gap-8 border-r border-white/10 bg-white/5 backdrop-blur-2xl px-6 py-8"
                    animate={{ width: sidebarOpen ? 260 : 110 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                                <Check className="w-6 h-6 text-white" />
                            </div>
                            {sidebarOpen && (
                                <div>
                                    <h1 className="text-lg font-semibold">Task Manager</h1>
                                    <p className="text-xs text-slate-300/70">Futuristic control</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            className="h-10 w-10 rounded-xl border border-white/10 bg-white/10 text-white"
                        >
                            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {sidebarItems.map((item) => (
                            <motion.button
                                key={item.label}
                                type="button"
                                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-sm text-white/80 hover:text-white"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <item.icon className="h-5 w-5 text-indigo-200" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </motion.button>
                        ))}
                    </div>

                    <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300/80">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">Focus</p>
                        <p className="mt-2 text-base text-white">Keep momentum in motion.</p>
                    </div>
                </motion.aside>

                <div className="flex-1 min-w-0">
                    {/* HEADER */}
                    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-2xl">
                        <div className="max-w-7xl mx-auto px-6 py-5">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowProfilePanel(true)}
                                        className="flex items-center justify-center h-12 w-12 rounded-2xl border border-white/10 bg-white/10 shadow-sm hover:shadow-md"
                                        aria-label="Open profile settings"
                                    >
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="h-11 w-11 rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <UserCircle className="w-7 h-7 text-indigo-300" />
                                        )}
                                    </button>
                                    <div>
                                        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                                        <p className="text-sm text-slate-300/70">
                                            Welcome back, {user?.username || 'User'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <LiveClock />
                                    <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
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
                                <div className="relative flex-1 min-w-[240px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search tasks..."
                                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>

                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="px-4 py-3.5 rounded-2xl bg-white/10 border border-white/10 text-white"
                                >
                                    <option value="ALL">All Priorities</option>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3.5 rounded-2xl bg-white/10 border border-white/10 text-white"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>

                                <motion.button
                                    onClick={() => openTaskModal()}
                                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow hover:scale-105 transition flex items-center gap-2"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Plus className="w-5 h-5" /> New Task
                                </motion.button>

                                <button
                                    className="px-6 py-3 rounded-2xl border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition flex items-center gap-2"
                                >
                                    <Calendar className="w-5 h-5" /> Download Report
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* MAIN */}
                    <main className="max-w-7xl mx-auto px-6 py-12">
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {[
                                { label: 'Total Tasks', value: stats.total, accent: 'from-indigo-500 to-purple-500' },
                                { label: 'In Progress', value: stats.inProgress, accent: 'from-sky-500 to-indigo-500' },
                                { label: 'Completed', value: stats.completed, accent: 'from-emerald-500 to-green-500' },
                            ].map((card, index) => (
                                <motion.div
                                    key={card.label}
                                    className="p-5 rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-2xl"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <p className="text-sm text-slate-300/70">{card.label}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-3xl font-semibold text-white">
                                            <AnimatedCounter value={card.value} />
                                        </span>
                                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${card.accent}`} />
                                    </div>
                                </motion.div>
                            ))}
                        </section>

                        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-semibold text-white">Your Tasks</h2>
                                <p className="text-sm text-slate-300/70">
                                    Browse tasks in a list or calendar view.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                                        viewMode === 'list'
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'border-white/10 text-white/80 hover:bg-white/10'
                                    }`}
                                >
                                    <List className="w-4 h-4" /> List
                                </button>
                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                                        viewMode === 'calendar'
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'border-white/10 text-white/80 hover:bg-white/10'
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4" /> Calendar
                                </button>
                            </div>
                        </div>

                        {viewMode === 'list' ? (
                            <>
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                        {Array.from({ length: 6 }, (_, index) => (
                                            <TaskCardSkeleton key={`skeleton-${index}`} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                        <AnimatePresence>
                                            {currentTasks.map((task, index) => (
                                                <motion.div
                                                    key={task.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 20 }}
                                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                                >
                                                    <TaskCard
                                                        task={task}
                                                        onClick={() => openDetailModal(task)}
                                                    />
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-14">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-40"
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
                                                        : 'hover:bg-white/10 text-white/80'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-40"
                                        >
                                            <ChevronRight />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-8">
                                <CalendarView
                                    tasks={tasks}
                                    selectedDate={selectedDate}
                                    currentMonth={calendarMonth}
                                    onMonthChange={setCalendarMonth}
                                    onDateSelect={setSelectedDate}
                                />
                                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.2)] backdrop-blur-2xl">
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-300/70">Tasks for</p>
                                        <h3 className="text-xl font-semibold text-white">
                                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </h3>
                                    </div>
                                    {loading ? (
                                        <p className="text-sm text-slate-300/70">Loading tasks...</p>
                                    ) : tasksForSelectedDate.length === 0 ? (
                                        <p className="text-sm text-slate-300/70">
                                            No tasks scheduled for this date.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {tasksForSelectedDate.map((task) => (
                                                <button
                                                    key={task.id}
                                                    onClick={() => openDetailModal(task)}
                                                    className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:shadow-md"
                                                >
                                                    <h4 className="font-semibold text-white">
                                                        {task.taskName}
                                                    </h4>
                                                    <p className="text-sm text-slate-300/70 line-clamp-2">
                                                        {task.description || 'No description'}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

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

            {showProfilePanel && (
                <ProfilePanel
                    user={user}
                    onClose={() => setShowProfilePanel(false)}
                    onSave={handleProfileSave}
                    isSaving={isSavingProfile}
                />
            )}
        </div>
    );
};

export default Dashboard;
