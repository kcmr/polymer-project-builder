'use strict';

const log = require('fancy-log');
const chalk = require('chalk');
const { log: logger } = require('../../../lib/logger');

jest.mock('fancy-log');

describe('log', () => {
	const message = 'message';

	it('logs message in yellow color with type "warning"', () => {
		logger(message, 'warning');
		expect(log).toBeCalledWith(chalk.yellow(message));
	});

	it('logs error message in red color with type "error"', () => {
		logger(message, 'error');
		expect(log.error).toBeCalledWith(chalk.red(message));
	});

	it('logs message in green color with no specified type', () => {
		logger(message);
		expect(log).toBeCalledWith(chalk.green(message));
	});
});
