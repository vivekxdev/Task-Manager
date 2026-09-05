import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createTask, updateTask, fetchTask } from '../store/taskSlice';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentTask, loading: taskLoading } = useAppSelector(state => state.tasks);
  const { loading } = useAppSelector(state => state.tasks);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      dispatch(fetchTask(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentTask && isEditing) {
      setFormData({
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
        priority: currentTask.priority,
        dueDate: currentTask.dueDate ? new Date(currentTask.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [currentTask, isEditing]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length > 100) newErrors.title = 'Title cannot exceed 100 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length > 1000) newErrors.description = 'Description cannot exceed 1000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      dueDate: formData.dueDate || undefined
    };

    try {
      if (isEditing) {
        await dispatch(updateTask({ id, data: submitData })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(submitData)).unwrap();
        toast.success('Task created successfully');
      }
      navigate('/tasks');
    } catch (error) {
      toast.error(error?.message || 'Failed to save task');
    }
  };

  if (isEditing && taskLoading && !currentTask) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">{isEditing ? 'Edit Task' : 'Create Task'}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {isEditing ? 'Update your task details' : 'Fill in the details to create a new task'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="form-group">
          <label htmlFor="title" className="label label-required">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={100}
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'input-error' : ''}`}
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
            disabled={loading}
          />
          {errors.title && <p id="title-error" className="form-error" role="alert">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="label label-required">Description</label>
          <textarea
            id="description"
            name="description"
            required
            maxLength={1000}
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`textarea ${errors.description ? 'input-error' : ''}`}
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : 'description-hint'}
            disabled={loading}
          />
          {errors.description && <p id="description-error" className="form-error" role="alert">{errors.description}</p>}
          <p id="description-hint" className="form-hint">{formData.description.length}/1000 characters</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="status" className="label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select"
              disabled={loading}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority" className="label">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select"
              disabled={loading}
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate" className="label">Due Date (Optional)</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="input"
            disabled={loading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
}