const dotenv = require('dotenv');
dotenv.config();
 
const login = process.env.API_LOGIN || '';
const password = process.env.API_PASSWORD || '';
const credentials = Buffer.from(`${login}:${password}`).toString('base64');
 
exports.config = {
  tests: './features/**/*.feature',
  output: './reports',
 
  helpers: {
    REST: {
      endpoint: process.env.API_URL || 'https://cloudrun-api-yugcnet4yq-ew.a.run.app',
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      timeout: 15000
    },
    JSONResponse: {}
  },
 
  gherkin: {
    features: './features/**/*.feature',
    steps: [
      './step_definitions/order_steps.ts'
    ]
  },
 
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    }
  },
 
  name: 'hipay-analyst'
}
 