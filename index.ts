import express from 'express';
import dotenv from 'dotenv';
import uniRoutes from './src/routes/universities';
import path from 'path';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/CSVfileData', express.static(path.join(__dirname, 'CSVfileData')));

app.use(express.json());

// Routes
app.use('/api', uniRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
