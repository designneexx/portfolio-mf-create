import React, { FC, lazy, ReactNode, Suspense } from 'react';
import { useDynamicScript } from 'src/hooks/useDynamicScript';
import { MicroService } from 'src/types/common';
import { loadComponent } from 'src/utils/loadComponent';
import { ErrorBoundary } from './ErrorBoundary';

interface ILazyServiceProps<T = Record<string, unknown>> {
    data?: T;
    errorMessage?: ReactNode;
    loadingMessage?: ReactNode;
    microservice: MicroService;
}

export function LazyService<T = Record<string, unknown>>({
    data,
    errorMessage,
    loadingMessage,
    microservice
}: ILazyServiceProps<T>): JSX.Element {
    const { failed, ready } = useDynamicScript(microservice.url);
    const { module, scope } = microservice;

    const errorNode = errorMessage || (
        <span>Failed to load dynamic script: {microservice.url}</span>
    );

    if (failed) {
        return <>{errorNode}</>;
    }

    const loadingNode = loadingMessage || <span>Loading dynamic script: {microservice.url}</span>;

    if (!ready) {
        return <>{loadingNode}</>;
    }

    const Component = lazy(() =>
        loadComponent<{ default: FC<Record<string, unknown>> }>(scope, module)
    );

    return (
        <ErrorBoundary>
            <Suspense fallback={loadingNode}>
                <Component {...data} />
            </Suspense>
        </ErrorBoundary>
    );
}
