import { createTheme } from '@material-ui/core/styles';

const props = {
	MuiTextField: {
		variant: 'outlined',
	},
	MuiSelect: {
		variant: 'outlined',
	},
	MuiInputLabel: {
		shrink: true,
	},
	MuiButton: {
		variant: 'contained',
		color: 'secondary',
	},
};

const overrides = {
	MuiInputLabel: {
		outlined: {
			'&$shrink': {
				transform: 'none',
				position: 'initial',
				marginBottom: 12,
			},
		},
		animated: {
			'&$shrink': {
				transform: 'none',
				position: 'initial',
				marginBottom: 12,
			},
		},
		asterisk: {
			color: '#db183f',
		},
	},
};

export default createTheme({
	palette: {
		primary: {
			dark: '#35919d',
			main: '#4dd0e1',
			light: '#70d9e7',
		},
		secondary: {
			dark: '#b26046',
			main: '#ff8a65',
			light: '#ffa183',
		},
		text: {
			primary: '#404040',
			secondary: '#7d7d7d',
		}
	},
	typography: {
		fontFamily: "'Work Sans', sans-serif",
		fontSize: 16,
		fontWeightLight: 300, // Work Sans
		fontWeightRegular: 400, // Work Sans
		fontWeightMedium: 700, // Roboto Condensed
		fontFamilySecondary: "'Roboto Condensed', sans-serif",
	},
	props,
	overrides,
});
