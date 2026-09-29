import mongoose from 'mongoose'

function redactConnectionDetails(message, uri) {
  let sensitiveValues = [uri]

  try {
    const parsedUri = new URL(uri)
    sensitiveValues = sensitiveValues.concat([
      parsedUri.hostname,
      parsedUri.host,
      decodeURIComponent(parsedUri.username),
      decodeURIComponent(parsedUri.password),
    ])
  } catch {
    return message.replace(/mongodb(?:\+srv)?:\/\/[^\s"']+/gi, '[REDACTED_MONGODB_URI]')
  }

  return sensitiveValues
    .filter(Boolean)
    .reduce((safeMessage, secret) => safeMessage.split(secret).join('[REDACTED]'), message)
    .replace(/mongodb(?:\+srv)?:\/\/[^\s"']+/gi, '[REDACTED_MONGODB_URI]')
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is missing from the server environment.')
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected.')
  } catch (error) {
    const safeError = new Error(redactConnectionDetails(error.message, uri))
    safeError.name = error.name
    safeError.code = error.code
    throw safeError
  }
}