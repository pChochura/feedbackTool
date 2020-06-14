'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const config_service_1 = require('../modules/config/config.service');
const fs = require('fs');
fs.writeFileSync(
	'ormconfig.json',
	JSON.stringify(
		config_service_1.postgresConfig.getConfig(['**/*.entity{.ts,.js}']),
		null,
		2
	)
);
//# sourceMappingURL=write-type-orm-config.js.map
