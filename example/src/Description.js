import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {Grid, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import CodeBlock from './CodeBlock';

const useStyles = makeStyles(() => ({
	root: {},
}));

export default function Description(props) {
	const classes = useStyles(props);
	const {t} = useTranslation();

	return (
		<Grid container {...props}>
			<Typography variant="h2">
				{t('The hook currently supports the following validators')}:
			</Typography>
			<Typography component="ul">
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						required - Required value
					</Trans>
				</Typography>
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						min - Min value of number or min length of string & array
					</Trans>
				</Typography>
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						email - Email address
					</Trans>
				</Typography>
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						url - URL
					</Trans>
				</Typography>
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						postalCodeCA - Postal Code in Canada
					</Trans>
				</Typography>
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						sinCA - Social Insurance Number (SIN) in Canada
					</Trans>
				</Typography>
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						pattern - RegEx patter based
					</Trans>
				</Typography>
				<Typography component="li">
					<Trans t={t} components={[<CodeBlock inline key={0} />]}>
						func - function based
					</Trans>
				</Typography>
			</Typography>
			<Typography variant="h3">
				<Trans t={t} components={[
					<Typography key={0} className={classes.inlineCode} />
				]}>
					You can import enum of them
				</Trans>
			</Typography>
			<CodeBlock>
				import {'{'}VALIDATORS{'}'} from 'react-hook-form-validation';
			</CodeBlock>
		</Grid>
	)
}

