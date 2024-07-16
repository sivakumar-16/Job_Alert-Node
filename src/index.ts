import express from 'express';
import { checkConnection } from '../dbConfig';
import route from './Routes/routes';
import concurrencyLimit from './middleware/concurrencyLimit';
import rateLimit from './middleware/rateLimit';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Successfully connected');
});

app.use('/job/', rateLimit);
app.use('/job/', concurrencyLimit);
app.use('/job',route)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    checkConnection();
})