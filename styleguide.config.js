const {name: packageName, version} = require('./package.json');
const fs = require('fs');
const path = require('path');

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
	theme: {
		fontFamily: {
			base: '"IBM Plex Sans", sans-serif',
			monospace: '"IBM Plex Mono", monospace',
		},
		color: {
			base: '#47494b',
			light: '#757575',
			link: '#244992',
			linkHover: '#218146',
			baseBackground: '#ffffff',
			codeBackground: '#fafafa',
			sidebarBackground: '#f3f6fc',
		},
	},
	sections: [
		{
			name: 'About',
			content: 'README.md',
		},
		{
			name: 'More examples',
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
					test: /\.ts?$/u,
					exclude: /node_modules/u,
					use: 'ts-loader',
				},
			],
		},
	},
};
