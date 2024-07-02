import { runInAction } from 'mobx';
import { PortfolioApi } from 'src/api/portfolio/types';
import { PortfolioStore } from 'src/stores/portfolioStore';
import { NotificationService } from './notificationService';

export class PortfolioService {
    constructor(
        private readonly portfolioStore: PortfolioStore,
        private readonly portfolioApi: PortfolioApi,
        private readonly notificationService: NotificationService
    ) {}

    async uploadResume(formData: FormData) {
        this.portfolioStore.setIsLoading(true);

        try {
            const { data } = await this.portfolioApi.uploadResume(formData);

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
