import React from 'react';
import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(({palette, spacing}) => ({
	root: {
		fontFamily: 'monospace',
		fontSize: '85%',
		backgroundColor: palette.primary.light,
		borderRadius: 6,

	},
	block: {
		display: 'block',
		whiteSpace: 'pre',
		padding: spacing(2),
		overflow: 'auto',
		lineHeight: 1.45,
	},
	inline: {
		display: 'inline-block',
		padding: '.2em .4em',
		margin: 0,
	},
}));

export default function CodeBlock({inline, ...props}) {
	const {block: blockClassName, inline: inlineClassName, ...classes} = useStyles(props);

	return (
		<Typography
			component="code"
			{...props}
			classes={{
				...classes,
				root: clsx(classes.root, {[inlineClassName]: inline, [blockClassName]: !inline}),
			}}
		/>
	);
}
