import express from 'express';
import { doorHealthHandler, doorOpenHandler } from './server/biostar';

const app = express();

app.get('/api/biostar/health', doorHealthHandler);
app.post('/api/biostar/open', doorOpenHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});