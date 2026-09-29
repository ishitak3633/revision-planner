const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'The request could not be completed.')
  }

  return result
}

export function getTasks() {
  return request('/tasks')
}

export function createTask(task) {
  return request('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export function updateTaskStatus(taskId, isCompleted) {
  return request(`/tasks/${encodeURIComponent(taskId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ isCompleted }),
  })
}