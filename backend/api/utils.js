const seedrandom = require('seedrandom');

module.exports = {
	generateId: (seed) => {
		const generator = seed ? seedrandom(seed) : seedrandom();
		return generator().toString(36).slice(2);
	},
};
