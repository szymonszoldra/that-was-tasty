import express from 'express';

const router = express.Router();

router.get('/', (_req, res): void => {
  res.render('index');
});

export default router;
