import React from 'react';
import {AppBar, Toolbar, IconButton, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import Form from './Form';

const useStyles = makeStyles(({spacing}) => ({
	root: {
		minHeight: '100%',
	},
	menuButton: {
		marginRight: spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	main: {
		padding: spacing(2),
		flexGrow: 1,
	},
	form: {
		maxWidth: 700,
		margin: '0 auto',
	},
}));

export default function App() {
	const classes = useStyles();

	return (
		<Grid container direction="column" className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						react-hook-form-validation examples
					</Typography>
				</Toolbar>
			</AppBar>
			<Grid component="main" className={classes.main}>
				<Form classes={{root: classes.form}} />
			</Grid>
		</Grid>
	);
}
