import { Router } from 'express';
import { registerUser } from '../controllers/auth';


const router = Router();

router.post('/register', registerUser);


export default router;

// Test endpoint - no auth required
router.get('/ping', (req, res) => {
  res.json({ message: 'Auth router is working', timestamp: Date.now() });
});