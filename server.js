require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

// api routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/images', require('./routes/images.route'));
  
// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4001;
app.listen(port, () => console.log('Server listening on port ' + port));