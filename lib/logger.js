'use strict';

const log = require('fancy-log');
const chalk = require('chalk');

function logger(message, type) {
	switch (type) {
		case 'warning':
			log(chalk.yellow(message));
			break;

		case 'error':
			log.error(chalk.red(message));
			break;

		default:
			log(chalk.green(message));
			break;
	}
}

module.exports = {
	log: logger
};
