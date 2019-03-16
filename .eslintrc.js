'use strict';

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module'
	},
	plugins: [
		'ember'
	],
	extends: [
		'eslint-config-bbva'
	],
	env: {
		browser: true
	},
	overrides: [{
		files: [
			'.commitlintrc.js',
			'.eslintrc.js',
			'index.js'
		],
		excludedFiles: [],
		parserOptions: {
			sourceType: 'script',
			ecmaVersion: 2015
		},
		env: {
			browser: false,
			node: true
		},
		plugins: ['node'],
		rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
			'no-process-env': 0
		})
	}]
};
