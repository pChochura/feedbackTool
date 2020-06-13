const seedrandom = require('seedrandom');
const mustache = require('mustache');
const fs = require('fs');

module.exports = {
	generateId: (seed) => {
		const generator = seed ? seedrandom(seed) : seedrandom();
		return generator().toString(36).slice(2);
	},

	composeEmail: (from, content) => {
		const emailTemplate = fs
			.readFileSync('./public/mailTemplate.html')
			.toLocaleString();
		return mustache.render(emailTemplate, {
			from,
			content,
		});
	},
};
