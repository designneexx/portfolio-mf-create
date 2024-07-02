import { useContext } from 'react';
import { AppRepositoryContext } from 'src/components/AppRepository';

export function useAppServices() {
    const context = useContext(AppRepositoryContext);

    if (!context) {
        throw new Error('App store context cannot be null');
    }

    return context.services;
}
