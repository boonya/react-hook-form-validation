module.exports = function ({color}) {
	return {
		Blockquote: {
			blockquote: {
				borderLeft: `5px solid ${color.border}`,
				margin: '16px 32px 16px 0',
				paddingLeft: 20,
			},
		},
		Playground: {
			preview: {
				color: color.base,
			},
		},
	}
}
