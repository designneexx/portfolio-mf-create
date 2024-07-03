import { NotificationService } from 'src/services/notificationService';
import { UserStore } from 'src/stores/userStore';
import { AppRepositoryProvider } from './AppRepository';
import { PortfolioCreatorForm } from './PortfolioCreatorForm';

type MainLayoutProps = {
    notificationService: NotificationService;
    userStore: UserStore;
};

export default function MFProvider({ notificationService, userStore }: MainLayoutProps) {
    return (
        <AppRepositoryProvider notificationService={notificationService} userStore={userStore}>
            <PortfolioCreatorForm />
        </AppRepositoryProvider>
    );
}
