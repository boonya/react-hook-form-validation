import React from 'react';
import {AppBar, Toolbar, Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useTranslation} from 'react-i18next';
import {Helmet} from 'react-helmet-async';
import Section from './Section';
import Description from './Description';
import ChainForm from './Forms/Chain';
import AsyncForm from './Forms/AsyncFunction';
import LanguageSwitcher from './LanguageSwitcher';

const useStyles = makeStyles(({spacing}) => ({
	root: {
		minHeight: '100%',
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
					<AsyncForm />
				</Section>
				<Section>
					<ChainForm />
				</Section>
			</Grid>
		</Grid>
	);
}