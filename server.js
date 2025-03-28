const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Раздаем статические файлы из папки build
app.use(express.static(path.join(__dirname, 'build')));

// Все запросы направляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Приложение доступно по адресу: http://localhost:${port}`);
}); 