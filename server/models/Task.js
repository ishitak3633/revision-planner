import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Duration must be a whole number.',
      },
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Task = mongoose.model('Task', taskSchema)

export default Task