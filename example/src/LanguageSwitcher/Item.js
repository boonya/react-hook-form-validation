import React from 'react';
import {MenuItem} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const Item = React.forwardRef(function Item({code, onClick, ...props}, ref) {
	const {t} = useTranslation();

	const lng = React.useMemo(() => t(`lng-${code}-label`), [t, code]);

	const handleClick = React.useCallback(() => onClick(code), [onClick, code]);

	return (
		<MenuItem
			ref={ref}
			onClick={handleClick}
			{...props}
		>
			{lng}
		</MenuItem>
	);
});

export default Item;
