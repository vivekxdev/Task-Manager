import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTasks, setFilters, setPage, clearFilters } from '../store/taskSlice';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import { format } from 'date-fns';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const sortOptions = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'title', label: 'Title' }
];

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { tasks, pagination, filters, loading } = useAppSelector(state => state.tasks);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = {
      search: localSearch || undefined,
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: searchParams.get('page') || 1,
      limit: 10
    };

    dispatch(setFilters(params));
    dispatch(fetchTasks(params));
  }, [dispatch, searchParams, localSearch]);

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearch) params.set('search', localSearch);
    else params.delete('search');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (key === 'sortBy') {
      params.set('sortBy', value);
      if (value === 'createdAt' || value === 'dueDate') {
        params.set('sortOrder', 'desc');
      } else {
        params.set('sortOrder', 'asc');
      }
    } else {
      params.set('sortOrder', value);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    const params = new URLSearchParams();
    setSearchParams(params);
    dispatch(clearFilters());
  };

  const hasActiveFilters = localSearch || searchParams.get('status') || searchParams.get('priority');
  const currentStatus = searchParams.get('status') || '';
  const currentPriority = searchParams.get('priority') || '';
  const currentSortBy = searchParams.get('sortBy') || 'createdAt';
  const currentSortOrder = searchParams.get('sortOrder') || 'desc';

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tasks</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage and organize your work</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          <PlusIcon className="w-5 h-5" />
          New Task
        </Link>
      </header>

      <section className="card" aria-label="Task filters and search">
        <div className="card-header">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Search by title or description..."
                className="input pl-10"
                aria-label="Search tasks"
                onFocus={(e) => e.target.select()}
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    const params = new URLSearchParams(searchParams);
                    params.delete('search');
                    params.set('page', '1');
                    setSearchParams(params);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Clear search"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:hidden">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center gap-2"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
            </div>
          </form>
        </div>

        <div className={`border-t border-neutral-200 ${showFilters ? '' : 'sm:hidden'} animate-slide-down`}>
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="status" className="label">Status</label>
              <select
                id="status"
                value={currentStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="select"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="priority" className="label">Priority</label>
              <select
                id="priority"
                value={currentPriority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="select"
              >
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="sortBy" className="label">Sort By</label>
              <select
                id="sortBy"
                value={currentSortBy}
                onChange={(e) => handleSortChange('sortBy', e.target.value)}
                className="select"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="sortOrder" className="label">Order</label>
              <select
                id="sortOrder"
                value={currentSortOrder}
                onChange={(e) => handleSortChange('sortOrder', e.target.value)}
                className="select"
              >
                <option value="asc">
                  <ChevronUpIcon className="w-4 h-4 inline mr-1" /> Ascending
                </option>
                <option value="desc">
                  <ChevronDownIcon className="w-4 h-4 inline mr-1" /> Descending
                </option>
              </select>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-secondary self-end flex items-center gap-2"
              >
                <XCircleIcon className="w-5 h-5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {loading && tasks.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <LoadingSpinner size="lg" />
            </div>
          ) : tasks.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-neutral-200">
                  <div className="text-sm text-neutral-700">
                    Showing <span className="font-medium text-neutral-900">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-medium text-neutral-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-neutral-900">{pagination.total}</span> results
                  </div>
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="btn-secondary text-sm"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    <span className="px-3 text-sm text-neutral-500" aria-current="page">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="btn-secondary text-sm"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state py-12">
              <MagnifyingGlassIcon className="empty-state-icon" />
              <h3 className="empty-state-title">No tasks found</h3>
              <p className="empty-state-description">
                {hasActiveFilters ? 'Try changing your search or filters.' : 'Get started by creating your first task.'}
              </p>
              {!hasActiveFilters && (
                <div className="empty-state-action">
                  <Link to="/tasks/new" className="btn-primary inline-flex items-center">
                    <PlusIcon className="w-5 h-5" />
                    Create your first task
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}