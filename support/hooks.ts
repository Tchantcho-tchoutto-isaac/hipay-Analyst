require('dotenv').config();

const { Before } = require('@codeceptjs/configure');
const { container } = require('codeceptjs');

Before(async () => {
  const login = process.env.API_LOGIN || '';
  const password = process.env.API_PASSWORD || '';
  const credentials = Buffer.from(`${login}:${password}`).toString('base64');

  const REST = container.helpers('REST');
  REST.options.defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${credentials}`
  };

  console.log(' Auth configurée pour les tests HiPay');
});