require('dotenv').config();

import app from './app';
import * as env from 'env-var';

const apiPort: number = env.get('PORT').default('5000').asPortNumber();

app.listen(apiPort, () => {
	console.log(`Listening on ${apiPort}`);
});
