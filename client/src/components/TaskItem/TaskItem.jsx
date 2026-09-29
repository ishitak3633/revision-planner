import './TaskItem.css'

function TaskItem({ task, onToggleTask }) {
  const priorityClass = `priority-${task.priority.toLowerCase()}`

  return (
    <article className={`task-item${task.isCompleted ? ' task-item-completed' : ''}`}>
      <input
        className="task-status"
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggleTask(task._id)}
        aria-label={`${task.topicName}: ${task.isCompleted ? 'completed' : 'pending'}`}
      />
      <div className="task-copy">
        <span className="task-course">{task.courseName}</span>
        <span className="task-topic">{task.topicName}</span>
      </div>
      <div className="task-meta">
        <span className={`priority ${priorityClass}`}>{task.priority}</span>
        <span className="task-duration">{task.duration} min</span>
      </div>
    </article>
  )
}

export default TaskItem