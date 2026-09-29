import { useEffect, useState } from 'react'
import TaskForm from '../TaskForm/TaskForm.jsx'
import TaskList from '../TaskList/TaskList.jsx'
import { createTask, getTasks, updateTaskStatus } from '../../services/taskService.js'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const pendingTasks = tasks.filter((task) => !task.isCompleted)
  const completedTasks = tasks.filter((task) => task.isCompleted)
  const pendingMinutes = pendingTasks.reduce(
    (total, task) => total + task.duration,
    0,
  )

  useEffect(() => {
    let isCurrent = true

    async function loadTasks() {
      setIsLoading(true)
      setLoadError('')

      try {
        const savedTasks = await getTasks()
        if (isCurrent) {
          setTasks(savedTasks)
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(error.message)
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadTasks()

    return () => {
      isCurrent = false
    }
  }, [reloadCount])

  async function handleAddTask(newTask) {
    const savedTask = await createTask(newTask)
    setTasks((currentTasks) => [savedTask, ...currentTasks])
  }

  async function handleToggleTask(taskId) {
    const task = tasks.find((item) => item._id === taskId)
    if (!task) return

    try {
      const updatedTask = await updateTaskStatus(taskId, !task.isCompleted)
      setTasks((currentTasks) =>
        currentTasks.map((item) => item._id === updatedTask._id ? updatedTask : item),
      )
      setActionError('')
    } catch (error) {
      setActionError(error.message)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Revision Study Planner home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span className="brand-name">
            <strong>REVISION</strong>
            <span>STUDY PLANNER</span>
          </span>
        </a>
        <p className="topbar-label"><span aria-hidden="true" /> YOUR STUDY DESK</p>
      </header>

      <main id="top">
        <section className="page-intro" aria-labelledby="page-title">
          <div className="intro-copy">
            <p className="eyebrow">A CLEAR PLAN, ONE TOPIC AT A TIME</p>
            <h1 id="page-title">Make room for a <em>better</em> study rhythm.</h1>
            <p className="intro-description">
              Gather your next study sessions in one calm, focused place.
            </p>
          </div>
          <div className="summary" aria-label="Task summary">
            <div className="summary-item">
              <span>UP NEXT</span>
              <strong>{pendingTasks.length}</strong>
              <small>sessions</small>
            </div>
            <div className="summary-item summary-item-accent">
              <span>TIME PLANNED</span>
              <strong>{pendingMinutes}<small> min</small></strong>
              <small>across pending tasks</small>
            </div>
          </div>
        </section>

        <section className="planner-layout" aria-label="Revision tasks">
          <aside className="form-panel" aria-labelledby="form-title">
            <div className="panel-heading">
              <span className="step-number">01</span>
              <div>
                <p className="eyebrow">START A SESSION</p>
                <h2 id="form-title">Plan a task</h2>
              </div>
            </div>
            <TaskForm onAddTask={handleAddTask} />
            <p className="form-footnote">Keep it focused. You can always plan another.</p>
          </aside>

          <div className="task-board" aria-busy={isLoading}>
            {isLoading ? (
              <p className="empty-message" role="status">Loading your tasks...</p>
            ) : loadError ? (
              <div className="api-error" role="alert">
                <span>{loadError}</span>
                <button
                  className="retry-button"
                  type="button"
                  onClick={() => setReloadCount((count) => count + 1)}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {actionError && <p className="api-error" role="alert">{actionError}</p>}
                <TaskList
                  title="Pending"
                  tasks={pendingTasks}
                  onToggleTask={handleToggleTask}
                />
                <TaskList
                  title="Completed"
                  tasks={completedTasks}
                  isCompleted
                  onToggleTask={handleToggleTask}
                />
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <span>REVISION STUDY PLANNER</span>
        <span>Small steps add up.</span>
      </footer>
    </div>
  )
}

export default App