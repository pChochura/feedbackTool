import { postgresConfig } from '../modules/config/config.service';
import fs = require('fs');

fs.writeFileSync(
	'ormconfig.json',
	JSON.stringify(postgresConfig.getConfig(['**/*.entity{.ts,.js}']), null, 2)
);
