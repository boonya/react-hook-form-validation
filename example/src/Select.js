import React from 'react';
import {
	FormControl,
	InputLabel,
	Select as MuiSelect,
	FormHelperText,
} from '@material-ui/core';

export default function Select({id, error, label, name, children, ...props}) {
	return (
		<FormControl error={Boolean(error)} {...props}>
			{label && <InputLabel id={id && `${id}-label`}>{label}</InputLabel>}
			<MuiSelect
				labelId={id && `${id}-label`}
				id={id}
				name={name}
			>
				{children}
			</MuiSelect>
			{error && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	)
}
