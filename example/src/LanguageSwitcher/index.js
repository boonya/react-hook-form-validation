import React from 'react';
import {Button, Menu} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import Item from './Item';
import {LANGUAGES} from '../i18next';

export default function LanguageSwitcher(props) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const {t, i18n} = useTranslation();

	const handleClick = React.useCallback((event) => {
		setAnchorEl(event.currentTarget);
	}, []);

	const handleClose = React.useCallback((...args) => {
		setAnchorEl(null);
	}, []);

	const handleChange = React.useCallback((code) => {
		i18n.changeLanguage(code);
		handleClose();
	}, [i18n, handleClose]);

	return (
		<div {...props}>
			<Button
				variant="text"
				color="default"
				aria-controls="language-menu"
				aria-haspopup="true"
				aria-label={t('Click to choose your language')}
				onClick={handleClick}
			>
				{i18n.language}
			</Button>
			<Menu
				id="language-menu"
				keepMounted
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{LANGUAGES.map((code) => (
					<Item key={code} onClick={handleChange} code={code} />
				))}
			</Menu>
		</div>
	);
}
