import axios, { type CreateAxiosDefaults } from 'axios';
import { observer } from 'mobx-react-lite';
import { createContext, PropsWithChildren, useEffect, useMemo } from 'react';
import { createPortfolioApi } from 'src/api/portfolio';
import { useConst } from 'src/hooks/useConst';
import { NotificationService } from 'src/services/notificationService';
import { PortfolioService } from 'src/services/portfolioService';
import { PortfolioStore } from 'src/stores/portfolioStore';
import { UserStore } from 'src/stores/userStore';
import { AppRepository } from './types';

export const AppRepositoryContext = createContext<AppRepository | null>(null);

const createAxiosInstance = (config?: CreateAxiosDefaults) =>
    axios.create({
        baseURL: process.env.BASE_API_URL,
        ...config
    });

interface AppRepositoryProviderProps {
    notificationService: NotificationService;
    userStore: UserStore;
}

function AppRepositoryProviderComponent({
    children,
    notificationService,
    userStore
}: PropsWithChildren<AppRepositoryProviderProps>) {
    const instance = useConst(() =>
        createAxiosInstance({
            headers: {
                Authorization: `Bearer ${userStore.accessToken}`
            }
        })
    );
    const portfolioApi = useConst(() => createPortfolioApi(instance));
    const portfolioStore = useConst(() => new PortfolioStore());
    const portfolioService = useConst(
        () => new PortfolioService(portfolioStore, portfolioApi, notificationService)
    );

    const appRepository = useMemo(
        () => ({
            services: {
                notificationService,
                portfolioService
            },
            stores: {
                portfolioStore,
                userStore
            }
        }),
        [notificationService, userStore, portfolioService, portfolioStore]
    );

    useEffect(() => {
        if (instance.defaults.headers.common.Authorization || !userStore.accessToken) return;

        instance.defaults.headers.common = {
            Authorization: `Bearer ${userStore.accessToken}`
        };
    }, [userStore.accessToken, instance]);

    return (
        <AppRepositoryContext.Provider value={appRepository}>
            {children}
        </AppRepositoryContext.Provider>
    );
}

export const AppRepositoryProvider = observer(AppRepositoryProviderComponent);
