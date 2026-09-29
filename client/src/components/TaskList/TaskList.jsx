import TaskItem from '../TaskItem/TaskItem.jsx'
import './TaskList.css'

function TaskList({ title, tasks, isCompleted = false, onToggleTask }) {
  const listClass = isCompleted ? 'task-list task-list-completed' : 'task-list'

  return (
    <section className={listClass} aria-label={`${title} tasks`}>
      <div className="list-heading">
        <h2><span aria-hidden="true" />{title}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      {tasks.length > 0 ? (
        <div className="task-items">
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} onToggleTask={onToggleTask} />
          ))}
        </div>
      ) : (
        <p className="empty-message">No {title.toLowerCase()} tasks yet.</p>
      )}
    </section>
  )
}

export default TaskList