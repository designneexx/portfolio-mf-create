import { ChakraProvider } from '@chakra-ui/react';
import MFProvider from './components/MFProvider';
import { appTheme } from './consts/appTheme';
import { useConst } from './hooks/useConst';
import { NotificationService } from './services/notificationService';
import { UserStore } from './stores/userStore';
import { EventEmitter } from './utils/EventEmitter';

export default function App() {
    const eventEmitter = useConst(() => new EventEmitter());
    const userStore = useConst(() => new UserStore());
    const notificationService = useConst(() => new NotificationService(eventEmitter));

    return (
        <ChakraProvider theme={appTheme}>
            <MFProvider notificationService={notificationService} userStore={userStore} />
        </ChakraProvider>
    );
}
