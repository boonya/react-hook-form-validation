import React from 'react';
import {AppBar, Toolbar, IconButton, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import {useTranslation} from 'react-i18next';
import {Helmet} from 'react-helmet-async';
import Section from './Section';
import Description from './Description';
import ChainForm from './Forms/Chain';
import LanguageSwitcher from './LanguageSwitcher';

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
		padding: spacing(2, 0),
		flexGrow: 1,
	},
}));

export default function App() {
	const classes = useStyles();
	const {t} = useTranslation();

	return (
		<Grid container direction="column" className={classes.root}>
			<Helmet>
				<title>{t('React Hook for Form Validation')}</title>
				<meta name="theme-color" content="#000000" />
			</Helmet>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{t('React Hook for Form Validation')}
					</Typography>
					<LanguageSwitcher />
				</Toolbar>
			</AppBar>
			<Grid component="main" className={classes.main}>
				<Section>
					<Description />
				</Section>
				<Section>
					<ChainForm />
				</Section>
			</Grid>
		</Grid>
	);
}
