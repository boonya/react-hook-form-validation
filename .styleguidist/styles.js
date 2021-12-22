module.exports =function ({color}) {
	return {
		Playground: {
			preview: {
				color: color.base,
				'& input': {
					fontSize: 'inherit',
					background: 'none',
					outline: 'none',
					border: `1px solid ${color.base}`,
					borderRadius: 4,
					padding: 8,
					// height: '1.4375em',
					'&:hover': {
						border: `1px solid ${color.light}`,
					}
				},
			},
		},
	}
}
