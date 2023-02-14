const express = require('express');
const cors = require('cors');
const { urlencoded } = require('express');

const port = 5000;
const app = express();

// Config JSON response
app.use(express.json());



// Solve CORS 
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}));

// Public folder for images
app.use(express.static('puplic'));

// Routers
const UserRoutes = require('./routes/UserRoutes');

app.use('/users', UserRoutes)

app.listen(port, () => {
    console.log(`API is running in port: ${port}`);
})