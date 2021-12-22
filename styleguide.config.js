/* eslint-disable @typescript-eslint/no-var-requires */
const {name: packageName, version} = require('./package.json');
const styles = require('./.styleguidist/styles');
const theme = require('./.styleguidist/theme');
const path = require('path');
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
	title: packageName,
	version,
	template: {
		head: {
			links: [
				{
					rel: 'preconnect',
					href: 'https://fonts.googleapis.com',
				},
				{
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
					crossorigin: true,
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans&display=swap',
				},
			],
		},
	},
	theme,
	styles,
	ribbon: {
		text: 'Follow on Github',
		url: 'https://github.com/boonya/react-hook-form-validation',
	},
	contextDependencies: [
		path.resolve(__dirname, 'docs'),
	],
	sections: [
		{
			name: 'README',
			content: 'README.md',
			sections: [
				{
					name: 'Installation',
					href: '#installation',
				},
				{
					name: 'Validators',
					href: '#the-hook-currently-supports-the-following-validators',
				},
			],
		},
		{
			name: 'Examples',
			sections: [
				{
					name: 'Chain',
					content: 'docs/chain.md',
				},
			],
		},
	],
	moduleAliases: {
		'react-hook-form-validation': path.resolve(__dirname, './src/'),
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.ts$/u,
					exclude: /node_modules/u,
					loader: 'ts-loader',
				},
			],
		},
	},
};
