import express from 'express';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Successfully connected');
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})