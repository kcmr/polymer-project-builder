#!/usr/bin/env node

'use strict';

const CONFIG_FILE = '.polymerprojectrc';
const fs = require('fs');
const findUp = require('find-up');
const configPath = findUp.sync(CONFIG_FILE);
const config = configPath ? JSON.parse(fs.readFileSync(configPath)) : {};
const PolymerProjectBuilder = require('../lib/index');

const builder = new PolymerProjectBuilder(config);

builder.build();
