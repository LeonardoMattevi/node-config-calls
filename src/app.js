const config = require('config');
const path = require('path');
const port = process.env.PORT || 3000;

const helmet = require('helmet');

require('express-async-errors');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const schedule = require('node-schedule');
const masterCallsService = require('./services/masterCallsService');

require('./store/dbContext');

if (config.enableAccessLogs) {
  app.use(morgan('tiny'));
}
app.use(helmet());
app.use(express.static('public'));

app.use('/', function (req, res) {
  res.send('ok');
});

app.listen(port, () => {
  console.log(`listening on port ${port}...`);

  const job = schedule.scheduleJob('* * * * *', function () {
    masterCallsService.do();
  });

  console.log('job: ', job);

});
