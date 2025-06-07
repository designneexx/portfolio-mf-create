import * as axios from 'axios';
import axiosRetry, { exponentialDelay } from 'axios-retry';
import { runInAction } from 'mobx';
import { PortfolioApi } from 'src/api/portfolio/types';
import { axiosClient } from 'src/components/AppRepository';
import { AXIOS_CLIENT_RETRIES } from 'src/consts/common';
import { PortfolioStore } from 'src/stores/portfolioStore';
import { NotificationService } from './notificationService';

export class PortfolioService {
    private uploadStorageCancelToken = axios.default.CancelToken.source();
    public uploadStorageAbortController = new AbortController();

    constructor(
        private readonly portfolioStore: PortfolioStore,
        private readonly portfolioApi: PortfolioApi,
        private readonly notificationService: NotificationService
    ) {}

    async deleteResume(resumeId: string) {
        try {
            await this.portfolioApi.deleteResume(resumeId);

            this.portfolioStore.setPortfolio(null);

            return true;
        } catch (err) {
            const error = err as Error;

            this.notificationService.notifyAnError({
                title: error.message || 'Неизвестная ошибка'
            });

            return false;
        }
    }

    async getResumeByUserId(userId: string) {
        try {
            const { data } = await this.portfolioApi.getResumeByUserId(userId);

            this.portfolioStore.setPortfolio(data);

            return true;
        } catch (err) {
            const error = err as Error;

            this.notificationService.notifyAnError({
                title: error.message || 'Неизвестная ошибка'
            });

            return false;
        }
    }

    async uploadResume(formData: FormData, config?: axios.AxiosRequestConfig) {
        this.portfolioStore.setIsLoading(true);

        this.uploadStorageCancelToken.cancel();

        this.uploadStorageCancelToken = axios.default.CancelToken.source();

        axiosRetry(axiosClient, {
            onRetry: (currentRetry, error) => {
                function getErrorMessage() {
                    if (currentRetry === 0) {
                        return `${error.message || 'Неизвестная ошибка'}, пытаюсь повторить запрос...`;
                    }

                    return `Попытка номер ${currentRetry} повторить запрос, ошибка ${error.message || 'Неизвестная ошибка'}`;
                }

                this.notificationService.notifyAnError({
                    title: getErrorMessage()
                });
            },
            retries: AXIOS_CLIENT_RETRIES,
            retryCondition: (error) => {
                const isCanceled = axios.isCancel(error);

                if (isCanceled) {
                    this.uploadStorageAbortController = new AbortController();
                }

                return !isCanceled;
            },
            retryDelay: exponentialDelay
        });

        try {
            const { data } = await this.portfolioApi.uploadResume(formData, {
                cancelToken: this.uploadStorageCancelToken.token,
                signal: this.uploadStorageAbortController.signal,
                ...config
            });

            runInAction(() => {
                this.portfolioStore.setIsCreated(true);
                this.portfolioStore.setPortfolio(data);
            });

            this.notificationService.notifyAnSuccess({
                title: 'Ваше портфолио успешно создано. Через 5 секунд вы будете перенаправлены на ваш сайт'
            });

            return true;
        } catch (err) {
            const error = err as Error;

            this.notificationService.notifyAnError({
                title: error.message || 'Неизвестная ошибка'
            });

            return false;
        } finally {
            this.portfolioStore.setIsLoading(false);
        }
    }
}
