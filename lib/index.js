'use strict';

const { PolymerProject, HtmlSplitter, getOptimizeStreams } = require('polymer-build');
const mergeStream = require('merge-stream');
const vinyl = require('vinyl-fs');
const spliter = new HtmlSplitter();

function pipeStreams(streams) {
	return Array.prototype.concat.apply([], streams)
		.reduce((a, b) => a.pipe(b));
}

module.exports = class PolymerProjectBuilder {
	constructor(options = {}) {
		this.options = options;
		this.buildConfig = this.options.build;

		this.init();
	}

	init() {
		this.project = new PolymerProject(this.options);

		this.buildOptions = Object.assign({}, this.buildConfig, {
			name: 'custom-build',
			js: Object.assign({}, this.buildConfig.js, {
				moduleResolution: this.project.config.moduleResolution
			}),
			entrypointPath: this.project.config.entrypoint,
			rootDir: this.project.config.root
		});
	}

	build() {
		// eslint-disable-next-line no-unused-vars
		let buildStream = mergeStream(
			this.project.sources(),
			this.project.dependencies()
		);

		buildStream = buildStream.pipe(this.project.bundler({
			stripComments: true,
			rewriteUrlsInTemplates: false
		}));

		buildStream = pipeStreams([
			buildStream,
			spliter.split(),
			getOptimizeStreams(this.buildOptions),
			spliter.rejoin()
		]);

		buildStream = buildStream.pipe(
			vinyl.dest(this.options.dest)
		);
	}
};
