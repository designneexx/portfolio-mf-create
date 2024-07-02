import { NotificationService } from 'src/services/notificationService';
import { PortfolioService } from 'src/services/portfolioService';
import { PortfolioStore } from 'src/stores/portfolioStore';
import { UserStore } from 'src/stores/userStore';

export interface AppStores {
    portfolioStore: PortfolioStore;
    userStore: UserStore;
}

export interface AppServices {
    notificationService: NotificationService;
    portfolioService: PortfolioService;
}

export interface AppRepository {
    services: AppServices;
    stores: AppStores;
}
