import mongoose from 'mongoose'
import Task from '../models/Task.js'

const priorities = ['High', 'Medium', 'Low']

export async function getTasks(request, response) {
  const tasks = await Task.find().sort({ createdAt: -1 })
  return response.status(200).json(tasks)
}

export async function createTask(request, response) {
  const body = request.body

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return response.status(400).json({ message: 'A task object is required.' })
  }

  const { courseName, topicName, priority, duration } = body

  if (typeof courseName !== 'string' || !courseName.trim()) {
    return response.status(400).json({ message: 'Course name is required.' })
  }

  if (typeof topicName !== 'string' || !topicName.trim()) {
    return response.status(400).json({ message: 'Topic name is required.' })
  }

  if (!priorities.includes(priority)) {
    return response.status(400).json({ message: 'Priority must be High, Medium, or Low.' })
  }

  if (!Number.isInteger(duration) || duration <= 0) {
    return response.status(400).json({ message: 'Duration must be a positive whole number.' })
  }

  try {
    const task = await Task.create({
      courseName: courseName.trim(),
      topicName: topicName.trim(),
      priority,
      duration,
    })

    return response.status(201).json(task)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return response.status(400).json({ message: 'Task data is invalid.' })
    }

    throw error
  }
}

export async function updateTask(request, response) {
  const body = request.body

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return response.status(400).json({ message: 'An update object is required.' })
  }

  if (typeof body.isCompleted !== 'boolean') {
    return response.status(400).json({ message: 'isCompleted must be true or false.' })
  }

  if (!mongoose.isObjectIdOrHexString(request.params.id)) {
    return response.status(400).json({ message: 'Task ID is invalid.' })
  }

  try {
    const task = await Task.findByIdAndUpdate(
      request.params.id,
      { isCompleted: body.isCompleted },
      { new: true, runValidators: true },
    )

    if (!task) {
      return response.status(404).json({ message: 'Task not found.' })
    }

    return response.status(200).json(task)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return response.status(400).json({ message: 'Task update is invalid.' })
    }

    throw error
  }
}