const express = require('express');
const app = express();
const PORT = 3306;

app.get('/', (req, res) => {
  res.send('¡Servidor corriendo!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
