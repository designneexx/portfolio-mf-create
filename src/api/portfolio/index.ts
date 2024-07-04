import type { AxiosInstance } from 'axios';

import { PortfolioApi } from './types';

export const createPortfolioApi = (api: AxiosInstance): PortfolioApi => ({
    deleteResume: (resumeId, config) => api.delete(`/portfolio/resume/${resumeId}`, config),
    getResumeByUserId: (userId, config) =>
        api.get(`/portfolio/resume-by-user-id/${userId}`, config),
    uploadResume: (data, config) => api.post('/portfolio/resume', data, config)
});
