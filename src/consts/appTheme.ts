import { baseTheme, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { AppThemeColorMode } from 'src/types/appThemeColorMode';

export const appTheme = extendTheme(
    {
        colors: {
            primary: baseTheme.colors.green
        },
        config: {
            initialColorMode: AppThemeColorMode.Dark,
            useSystemColorMode: false
        },
        styles: {
            global: {
                body: {
                    display: 'grid',
                    gridTemplateRows: '1fr',
                    minHeight: '100vh'
                }
            }
        }
    },
    withDefaultColorScheme({ colorScheme: 'primary' })
);
