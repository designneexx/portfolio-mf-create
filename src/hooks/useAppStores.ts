import { useContext } from 'react';
import { AppRepositoryContext } from 'src/components/AppRepository';

export function useAppStores() {
    const context = useContext(AppRepositoryContext);

    if (!context) {
        throw new Error('App store context cannot be null');
    }

    return context.stores;
}
