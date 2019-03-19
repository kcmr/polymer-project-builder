#!/usr/bin/env node

'use strict';

const CONFIG_FILE = '.polymerprojectrc';
const fs = require('fs-extra');
const findUp = require('find-up');
const configFilePath = findUp.sync(CONFIG_FILE);

if (!configFilePath) {
	throw new Error(`No config file found in a ${CONFIG_FILE} file`);
}

const config = fs.readJSONSync(configFilePath);
const PolymerProjectBuilder = require('../lib/index');

const builder = new PolymerProjectBuilder(config);

builder.build();
