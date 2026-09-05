import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDashboardStats } from '../store/taskSlice';
import { PlusIcon, ClipboardDocumentListIcon, ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, CalendarIcon, ChartBarIcon, FlagIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { dashboardStats, loading } = useAppSelector(state => state.tasks);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalTasks = dashboardStats?.totalTasks || 0;
  const completedTasks = dashboardStats?.completedTasks || 0;
  const todoTasks = dashboardStats?.todoTasks || 0;
  const inProgressTasks = dashboardStats?.inProgressTasks || 0;
  const highPriorityTasks = dashboardStats?.highPriorityTasks || 0;
  const overdueTasks = dashboardStats?.overdueTasks || 0;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const mediumPriorityTasks = Math.max(0, totalTasks - highPriorityTasks - (dashboardStats?.lowPriorityTasks || 0));
  const lowPriorityTasks = dashboardStats?.lowPriorityTasks || Math.max(0, totalTasks - highPriorityTasks - mediumPriorityTasks);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name?.split(' ')[0] || 'there';

  const stats = [
    {
      name: 'Total Tasks',
      value: totalTasks,
      icon: ClipboardDocumentListIcon,
      color: 'bg-primary-100 text-primary-600',
      iconColor: 'text-primary-600',
      href: '/tasks',
      trend: null
    },
    {
      name: 'To Do',
      value: todoTasks,
      icon: ClipboardDocumentListIcon,
      color: 'bg-neutral-100 text-neutral-600',
      iconColor: 'text-neutral-600',
      href: '/tasks?status=todo',
      trend: null
    },
    {
      name: 'In Progress',
      value: inProgressTasks,
      icon: ArrowPathIcon,
      color: 'bg-primary-100 text-primary-600',
      iconColor: 'text-primary-600',
      href: '/tasks?status=in_progress',
      trend: null
    },
    {
      name: 'Completed',
      value: completedTasks,
      icon: CheckCircleIcon,
      color: 'bg-success-100 text-success-600',
      iconColor: 'text-success-600',
      href: '/tasks?status=completed',
      trend: completionRate > 0 ? `${completionRate}%` : null
    },
    {
      name: 'High Priority',
      value: highPriorityTasks,
      icon: ExclamationTriangleIcon,
      color: 'bg-danger-100 text-danger-600',
      iconColor: 'text-danger-600',
      href: '/tasks?priority=high',
      trend: highPriorityTasks > 0 ? 'Needs attention' : null
    },
    {
      name: 'Overdue',
      value: overdueTasks,
      icon: ClockIcon,
      color: 'bg-warning-100 text-warning-600',
      iconColor: 'text-warning-600',
      href: '/tasks',
      trend: overdueTasks > 0 ? 'Take action' : null
    }
  ];

  const priorityData = [
    { name: 'High', value: highPriorityTasks, color: 'bg-danger-500', label: 'High priority' },
    { name: 'Medium', value: mediumPriorityTasks, color: 'bg-warning-500', label: 'Medium priority' },
    { name: 'Low', value: lowPriorityTasks, color: 'bg-success-500', label: 'Low priority' }
  ];

  const maxPriority = Math.max(...priorityData.map(p => p.value), 1);

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{getGreeting()}, {userName} 👋</h1>
          <p className="mt-1 text-sm text-neutral-500">Here&apos;s an overview of your tasks and progress.</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          <PlusIcon className="w-5 h-5" />
          New Task
        </Link>
      </header>

      <section aria-label="Statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              to={stat.href}
              className="card-interactive p-5 h-full"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <dt className="text-sm font-medium text-neutral-500 truncate">{stat.name}</dt>
                  <dd className="mt-1 text-3xl font-bold text-neutral-900 tabular-nums">{stat.value}</dd>
                  {stat.trend && (
                    <dd className="mt-1.5 text-xs text-neutral-500 flex items-center gap-1">
                      <ArrowTrendingUpIcon className="w-3 h-3" aria-hidden="true" />
                      {stat.trend}
                    </dd>
                  )}
                </div>
                <div className={`flex-shrink-0 p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card" aria-label="Task progress">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
                Task Progress
              </h2>
            </div>
          </div>
          <div className="card-body">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-6 sm:flex-1">
                <div className="relative flex-shrink-0" style={{ width: '100px', height: '100px' }}>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="8"
                      strokeDasharray={283}
                      strokeDashoffset={283 - (283 * completionRate) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{ transitionDelay: '200ms' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-neutral-900">{completionRate}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Completion Rate</p>
                  <p className="text-lg font-semibold text-neutral-900 mt-1">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                  <div className="mt-3 h-2 bg-neutral-200 rounded-full overflow-hidden w-full sm:w-64">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${completionRate}%`, transitionDelay: '200ms' }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 sm:flex-1 sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-success-500" aria-hidden="true" />
                  Completed: {completedTasks}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-500" aria-hidden="true" />
                  In Progress: {inProgressTasks}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-neutral-400" aria-hidden="true" />
                  To Do: {todoTasks}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card" aria-label="Priority distribution">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <FlagIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
              Priority Distribution
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {priorityData.map((priority) => {
                const percentage = totalTasks > 0 ? Math.round((priority.value / totalTasks) * 100) : 0;
                const barWidth = (priority.value / maxPriority) * 100;
                return (
                  <div key={priority.name} className="flex items-center gap-4">
                    <div className="w-20 flex-shrink-0">
                      <span className="text-sm font-medium text-neutral-700">{priority.name}</span>
                    </div>
                    <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: priority.color,
                          transitionDelay: '200ms'
                        }}
                      />
                    </div>
                    <div className="w-24 text-right text-sm font-medium text-neutral-900 tabular-nums">
                      {priority.value} ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-neutral-500 text-center">
              Based on {totalTasks} total task{totalTasks !== 1 ? 's' : ''}
            </p>
          </div>
        </section>
      </div>

      <section className="card" aria-label="Recent tasks">
        <div className="card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>
        <div className="divide-y divide-neutral-200">
          {dashboardStats?.recentTasks?.length > 0 ? (
            dashboardStats.recentTasks.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}/edit`}
                className="block p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-neutral-900 truncate">{task.title}</p>
                      <span className={statusBadgeMap[task.status] || 'badge-secondary'}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className={priorityBadgeMap[task.priority] || 'badge-secondary'}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-neutral-500 truncate sm:max-w-md">{task.description}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1.5 text-sm text-neutral-500">
                    {task.dueDate && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className={`w-4 h-4 ${isOverdue(task.dueDate, task.status) ? 'text-danger-500' : 'text-neutral-400'}`} />
                          <span className={isOverdue(task.dueDate, task.status) ? 'text-danger-600 font-medium' : ''}>
                            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            {isOverdue(task.dueDate, task.status) && ' (Overdue)'}
                          </span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-1.5 text-xs">
                      <ClockIcon className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Updated {format(new Date(task.updatedAt), 'MMM d')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state py-12">
              <ClipboardDocumentListIcon className="empty-state-icon" />
              <h3 className="empty-state-title">No tasks yet</h3>
              <p className="empty-state-description">Get started by creating your first task. It only takes a minute.</p>
              <div className="empty-state-action">
                <Link to="/tasks/new" className="btn-primary inline-flex items-center">
                  <PlusIcon className="w-5 h-5" />
                  Create your first task
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const statusBadgeMap = {
  todo: 'badge-todo',
  in_progress: 'badge-in_progress',
  completed: 'badge-completed',
};

const priorityBadgeMap = {
  low: 'badge-low',
  medium: 'badge-medium',
  high: 'badge-high',
};

function isOverdue(dueDate, status) {
  return dueDate && new Date(dueDate) < new Date() && status !== 'completed';
}