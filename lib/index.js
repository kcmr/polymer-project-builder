'use strict';

const { PolymerProject, HtmlSplitter, getOptimizeStreams } = require('polymer-build');
const mergeStream = require('merge-stream');
const path = require('path');
const fs = require('fs-extra');
const vinyl = require('vinyl-fs');
const { log } = require('./logger');
const splitter = new HtmlSplitter();
const crisper = require('crisper');
const HTMLPostCSS = require('html-postcss');
const autoprefixer = require('autoprefixer');
const htmlAutoprefixer = (config) => new HTMLPostCSS([autoprefixer(config)]);

function pipeStreams(streams) {
	return Array.prototype.concat.apply([], streams)
		.reduce((a, b) => a.pipe(b));
}

function waitFor(stream) {
	return new Promise(((resolve, reject) => {
		stream.on('end', resolve);
		stream.on('error', reject);
	}));
}

module.exports = class PolymerProjectBuilder {
	constructor(options = {}) {
		this.options = options;
		this.buildConfig = this.options.build;
		this.outputFile = this.options.bundleFileName || this.options.entrypoint;
		this.bundlePath = path.join(this.options.dest, this.outputFile);

		this.init();
	}

	init() {
		// add required entrypoint from htmlImportsFile
		this.options.entrypoint = this.options.htmlImportsFile;
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
			splitter.split(),
			getOptimizeStreams(this.buildOptions),
			splitter.rejoin()
		]);

		buildStream = buildStream.pipe(
			vinyl.dest(this.options.dest)
		);

		waitFor(buildStream)
			.then(() => this.postProcess());
	}

	postProcess() {
		this.renameBundle();
		this.autoprefixStyles();
		this.splitHtmlAndJs();
	}

	renameBundle() {
		if (this.options.bundleFileName) {
			const oldPath = path.join(this.options.dest, this.options.htmlImportsFile);

			log(`Writing ${this.bundlePath}`);

			fs.renameSync(oldPath, this.bundlePath);
		}
	}

	autoprefixStyles() {
		const cssOptions = this.buildConfig.css || {};

		if (cssOptions.autoprefixer) {
			const bundleContents = fs.readFileSync(this.bundlePath, 'utf8');
			const result = htmlAutoprefixer(cssOptions.autoprefixer.browsers).process(bundleContents);

			log('Autoprefixing styles');

			fs.writeFileSync(this.bundlePath, result);
		}
	}

	splitHtmlAndJs() {
		if (this.buildConfig.csp) {
			const bundleContents = fs.readFileSync(this.bundlePath, 'utf8');
			const jsFileName = this.outputFile.replace(path.extname(this.outputFile), '.js');

			const { html, js } = crisper({
				jsFileName,
				source: bundleContents,
				scriptInHead: false
			});

			log('Splitting HTML and JavaScript');

			fs.writeFileSync(this.bundlePath, html);
			fs.writeFileSync(path.join(this.options.dest, jsFileName), js);
		}
	}
};
