const express             = require('express');
const bodyParser          = require('body-parser');
const validator           = require('express-validator');
const router              = require('./routes');
const mongoose            = require('mongoose');
const nodeEnv             = process.env.NODE_ENV || "development";
const config              = require('./config.json')[nodeEnv];
////////////////////////////////////////////////////////////////////////////////

const app = express();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: true} ) );

app.use(router);

app.set( 'port', (process.env.PORT || 3000) );

if(require.main === module){
  mongoose.connect(config.mongoURL);
  app.listen(app.get('port'), () => console.log("App running on port ", app.get('port')) );
}

module.exports = app;
