import pkg from 'pg';
const { DatabaseError } = pkg;

export const handleErrors = (error, res) => {
  if (error instanceof DatabaseError) {
    return res.status(400).json({ success: false, error: 'Database error', details: error.message })
  } else {
    console.error(error)
    return res.status(500).json({ success: false, error: 'Something went wrong, please try again.' })
  }
}
