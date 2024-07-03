import { ColorModeScript } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { appTheme } from './consts/appTheme';
import { appElement } from './consts/domElements';

if (appElement) {
    const root = createRoot(appElement);
    root.render(
        <>
            <ColorModeScript initialColorMode={appTheme.config.initialColorMode} />
            <App />
        </>
    );
}
