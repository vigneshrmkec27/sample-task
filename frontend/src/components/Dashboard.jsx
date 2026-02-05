import React, { useEffect, useCallback, useMemo, useState } from 'react';
import {
    Search, Plus, Calendar, LogOut,
    Check, ChevronLeft, ChevronRight, UserCircle,
    LayoutGrid, List
} from 'lucide-react';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform
} from 'framer-motion';

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

/* -------------------- Animated Counter -------------------- */
const AnimatedCounter = ({ value }) => {
    const shouldReduceMotion = useReducedMotion();
    const motionValue = useMotionValue(value);
    const spring = useSpring(motionValue, { stiffness: 120, damping: 20 });
    const rounded = useTransform(spring, latest => Math.round(latest));

    useEffect(() => {
        motionValue.set(value);
    }, [motionValue, value]);

    if (shouldReduceMotion) return <span>{value}</span>;
    return <motion.span>{rounded}</motion.span>;
};

/* -------------------- Skeleton -------------------- */
const TaskCardSkeleton = () => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl shimmer">
        <div className="h-4 w-2/3 rounded bg-white/10 mb-3" />
        <div className="h-3 w-full rounded bg-white/10 mb-2" />
        <div className="h-3 w-5/6 rounded bg-white/10 mb-6" />
        <div className="flex justify-between">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-6 w-16 rounded bg-white/10" />
        </div>
    </div>
);

/* ==================== DASHBOARD ==================== */
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

    /* -------------------- Data -------------------- */
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await taskService.getAllTasks();
            const list = response?.content ?? response ?? [];
            setTasks(Array.isArray(list) ? list : []);
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
            result = result.filter(t =>
                t.taskName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (priorityFilter !== 'ALL') result = result.filter(t => t.priority === priorityFilter);
        if (statusFilter !== 'ALL') result = result.filter(t => t.status === statusFilter);
        setFilteredTasks(result);
        setCurrentPage(1);
    }, [tasks, searchQuery, priorityFilter, statusFilter]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);
    useEffect(() => { applyFilters(); }, [applyFilters]);

    /* -------------------- Helpers -------------------- */
    const handleLogout = () => {
        authService.logout();
        window.location.reload();
    };

    const stats = getTaskStats(tasks);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const currentTasks = filteredTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
    );

    const tasksForSelectedDate = tasks.filter(
        t => t.dueDate === selectedDate.toISOString().split('T')[0]
    );

    const sidebarItems = useMemo(() => ([
        { label: 'Overview', icon: LayoutGrid },
        { label: 'Tasks', icon: List },
        { label: 'Calendar', icon: Calendar }
    ]), []);

    /* ==================== UI ==================== */
    return (
        <div className={`relative min-h-screen transition-colors duration-300 ${
            darkMode ? 'dark bg-[#05060b] text-white' : 'bg-[#05060b] text-white'
        }`}>
            <motion.div className="absolute inset-0 aurora-gradient opacity-70" style={{ y: parallaxY }} />
            <div className="noise-layer" />

            <div className="relative z-10 flex min-h-screen">
                {/* SIDEBAR */}
                <motion.aside
                    className="hidden lg:flex flex-col gap-8 border-r border-white/10 bg-white/5 backdrop-blur-2xl px-6 py-8"
                    animate={{ width: sidebarOpen ? 260 : 110 }}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500">
                                <Check className="text-white" />
                            </div>
                            {sidebarOpen && <h1 className="font-semibold">Task Manager</h1>}
                        </div>
                        <button onClick={() => setSidebarOpen(p => !p)}>
                            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {sidebarItems.map(item => (
                            <button
                                key={item.label}
                                className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/10"
                            >
                                <item.icon />
                                {sidebarOpen && item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto text-sm text-white/70">
                        Keep momentum in motion 🚀
                    </div>
                </motion.aside>

                {/* MAIN */}
                <div className="flex-1 px-6 py-6">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setShowProfilePanel(true)}>
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="h-10 w-10 rounded-xl" />
                                ) : (
                                    <UserCircle />
                                )}
                            </button>
                            <div>
                                <h1 className="text-2xl font-semibold">Dashboard</h1>
                                <p className="text-white/60">Welcome back, {user?.username}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-center">
                            <LiveClock />
                            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-2 rounded-xl">
                                <LogOut />
                            </button>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {[
                            { label: 'Total Tasks', value: stats.total },
                            { label: 'In Progress', value: stats.inProgress },
                            { label: 'Completed', value: stats.completed }
                        ].map((s, i) => (
                            <motion.div
                                key={s.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-2xl bg-white/10"
                            >
                                <p className="text-white/60">{s.label}</p>
                                <div className="text-3xl font-bold">
                                    <AnimatedCounter value={s.value} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* VIEW TOGGLE */}
                    <div className="flex gap-2 mb-6">
                        <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-indigo-600 px-4 py-2 rounded-xl' : 'px-4 py-2'}>
                            <List /> List
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={viewMode === 'calendar' ? 'bg-indigo-600 px-4 py-2 rounded-xl' : 'px-4 py-2'}>
                            <LayoutGrid /> Calendar
                        </button>
                    </div>

                    {/* CONTENT */}
                    {viewMode === 'list' ? (
                        <>
                            {loading ? (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => <TaskCardSkeleton key={i} />)}
                                </div>
                            ) : (
                                <AnimatePresence>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {currentTasks.map((task, i) => (
                                            <motion.div
                                                key={task.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <TaskCard task={task} onClick={() => {
                                                    setSelectedTask(task);
                                                    setShowDetailModal(true);
                                                }} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </AnimatePresence>
                            )}
                        </>
                    ) : (
                        <CalendarView
                            tasks={tasks}
                            selectedDate={selectedDate}
                            currentMonth={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            onDateSelect={setSelectedDate}
                        />
                    )}
                </div>
            </div>

            {showTaskModal && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => setShowTaskModal(false)}
                    onSuccess={fetchTasks}
                    showNotification={showNotification}
                />
            )}

            {showDetailModal && selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={() => setShowDetailModal(false)}
                    onDelete={async () => {
                        await taskService.deleteTask(selectedTask.id);
                        fetchTasks();
                        setShowDetailModal(false);
                    }}
                />
            )}

            {showProfilePanel && (
                <ProfilePanel
                    user={user}
                    onClose={() => setShowProfilePanel(false)}
                    onSave={onUserUpdate}
                    isSaving={isSavingProfile}
                />
            )}
        </div>
    );
};

export default Dashboard;
