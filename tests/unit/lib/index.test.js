'use strict';

const PolymerProjectBuilder = require('../../../lib/index.js');
const { log: logger } = require('../../../lib/logger');

jest.mock('../../../lib/logger');

describe('PolymerProyectBuilder', () => {
	it('should call logger whtn _logError is called', () => {
		const builder = new PolymerProjectBuilder({
			dest: '',
			bundleFileName: 'bundle.html',
			build: {
				js: {}
			}
		});

		builder._logError('Test Error');

		expect(logger).toBeCalledWith('Error Building Polymer project: \nTest Error', 'error');
	});
});
