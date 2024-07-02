import type { AxiosInstance } from 'axios';

import { PortfolioApi } from './types';

export const createPortfolioApi = (api: AxiosInstance): PortfolioApi => ({
    uploadResume: (data, config) => api.post('/portfolio/resume', data, config)
});
