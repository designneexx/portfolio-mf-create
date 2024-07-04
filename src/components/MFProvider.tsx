import { NotificationService } from 'src/services/notificationService';
import { UserStore } from 'src/stores/userStore';
import { FEParameters } from 'src/types/common';
import { AppRepositoryProvider } from './AppRepository';
import { PortfolioCreatorForm } from './PortfolioCreatorForm';

type MainLayoutProps = {
    feParameters: FEParameters;
    notificationService: NotificationService;
    userStore: UserStore;
};

export default function MFProvider({
    feParameters,
    notificationService,
    userStore
}: MainLayoutProps) {
    return (
        <AppRepositoryProvider notificationService={notificationService} userStore={userStore}>
            <PortfolioCreatorForm feParameters={feParameters} />
        </AppRepositoryProvider>
    );
}
