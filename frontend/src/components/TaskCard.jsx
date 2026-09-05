import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useAppDispatch } from '../hooks/redux';
import { deleteTask } from '../store/taskSlice';
import toast from 'react-hot-toast';

const statusBadgeMap = {
  todo: 'badge-secondary',
  in_progress: 'badge-primary',
  completed: 'badge-success',
};

const priorityBadgeMap = {
  low: 'badge-secondary',
  medium: 'badge-warning',
  high: 'badge-danger',
};

const statusIconMap = {
  todo: '●',
  in_progress: '◐',
  completed: '✓',
};

export default function TaskCard({ task }) {
  const dispatch = useAppDispatch();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(task._id)).unwrap();
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <article className="card-interactive p-5 border-l-4 border-primary-500 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-neutral-900 truncate pr-2 group-hover:text-primary-600 transition-colors">{task.title}</h3>
        <div className="flex items-center space-x-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Link
            to={`/tasks/${task._id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="btn-ghost btn-icon-sm text-neutral-400 hover:text-neutral-600"
            aria-label="Edit task"
          >
            <PencilIcon className="w-5 h-5" />
          </Link>
          <button
            onClick={handleDelete}
            className="btn-ghost btn-icon-sm text-neutral-400 hover:text-danger-600"
            aria-label="Delete task"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={statusBadgeMap[task.status] || 'badge-secondary'} style={{ '--status-color': getStatusColor(task.status) }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            {task.status.replace('_', ' ')}
          </span>
        </span>
        <span className={priorityBadgeMap[task.priority] || 'badge-secondary'} style={{ '--priority-color': getPriorityColor(task.priority) }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            {task.priority}
          </span>
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center text-sm mb-3">
          <CalendarIcon className={`w-4 h-4 mr-1.5 ${isOverdue ? 'text-danger-500' : 'text-neutral-400'}`} aria-hidden="true" />
          <span className={isOverdue ? 'text-danger-600 font-medium' : 'text-neutral-500'}>
            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-100">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <ClockIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Created {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <ClockIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Updated {format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </article>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'todo': return '#737373';
    case 'in_progress': return '#2563eb';
    case 'completed': return '#16a34a';
    default: return '#737373';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'low': return '#737373';
    case 'medium': return '#d97706';
    case 'high': return '#dc2626';
    default: return '#737373';
  }
}