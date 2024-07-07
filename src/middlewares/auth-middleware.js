import jwt from 'jsonwebtoken';

export const verify = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not found' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' })
      }
      req.user = decodedToken 
      next()
    })
  } catch (err) {
    console.log(err.message)
  }
}




