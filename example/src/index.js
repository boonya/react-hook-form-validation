import React from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {I18nextProvider} from 'react-i18next';
import {HelmetProvider} from 'react-helmet-async';
import createI18Next from './i18next';
import theme from './theme';
import App from './App';

async function render() {
	const i18next = await createI18Next(process.env.PUBLIC_URL);

	ReactDOM.render(
		<React.StrictMode>
			<React.Suspense fallback="loading">
				<I18nextProvider i18n={i18next}>
					<ThemeProvider theme={theme}>
						<HelmetProvider>
							<CssBaseline />
							<App />
						</HelmetProvider>
					</ThemeProvider>
				</I18nextProvider>
			</React.Suspense>
		</React.StrictMode>,
		document.getElementById('root')
	);
}

render();
