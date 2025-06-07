import axios from 'axios';
import axiosRetry from 'axios-retry';
import { runInAction } from 'mobx';
import { PortfolioApi } from 'src/api/portfolio/types';
import { axiosClient } from 'src/components/AppRepository';
import { AXIOS_CLIENT_RETRIES } from 'src/consts/common';
import { PortfolioStore } from 'src/stores/portfolioStore';
import { NotificationService } from './notificationService';

export class PortfolioService {
    private uploadStorageCancelToken = axios.CancelToken.source();

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

    async uploadResume(formData: FormData) {
        this.portfolioStore.setIsLoading(true);

        this.uploadStorageCancelToken.cancel();

        this.uploadStorageCancelToken = axios.CancelToken.source();

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
            retryDelay: axiosRetry.exponentialDelay
        });

        alert(123);

        try {
            const { data } = await this.portfolioApi.uploadResume(formData, {
                cancelToken: this.uploadStorageCancelToken.token
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
