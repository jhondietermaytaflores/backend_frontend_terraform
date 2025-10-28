import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/health', (req, res) => res.json({ status: 'ok', role: 'backend' }));
app.get('/api/hello', (req, res) => res.send('holas dsd el backend!'));

app.listen(port, () => console.log(`Backend escuchando en ${port}`));
