import { useState } from 'react'
import './TaskForm.css'

function TaskForm({ onAddTask }) {
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const courseName = formData.get('courseName').trim()
    const topicName = formData.get('topicName').trim()
    const duration = Number(formData.get('duration'))

    if (!courseName || !topicName) {
      setMessage('Course and topic names cannot be blank.')
      return
    }

    if (!Number.isInteger(duration) || duration < 1) {
      setMessage('Enter a whole number of minutes above zero.')
      return
    }

    setMessage('')

    try {
      await onAddTask({
        courseName,
        topicName,
        priority: formData.get('priority'),
        duration,
      })
      form.reset()
      setMessage('Task added to Pending.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="course-name">Course name</label>
        <input
          id="course-name"
          name="courseName"
          type="text"
          placeholder="e.g. Biology"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="topic-name">Topic name</label>
        <input
          id="topic-name"
          name="topicName"
          type="text"
          placeholder="e.g. Cell structure"
          required
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" defaultValue="Medium">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="duration">Minutes</label>
          <input
            id="duration"
            name="duration"
            type="number"
            min="1"
            step="1"
            placeholder="30"
            required
          />
        </div>
      </div>

      <button className="submit-button" type="submit">
        <span className="plus-mark" aria-hidden="true">+</span>
        Add task
      </button>
      {message && (
        <p
          className={`form-message${message.startsWith('Task') ? '' : ' form-message-error'}`}
          role={message.startsWith('Task') ? 'status' : 'alert'}
        >
          {message}
        </p>
      )}
    </form>
  )
}

export default TaskForm