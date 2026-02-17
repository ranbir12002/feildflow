import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

// Typed API call helpers
export const fetchCompanies = () => api.get('/companies');
export const createCompany = (data: any) => api.post('/companies', data);

export const fetchUsers = () => api.get('/users');
export const createUser = (data: any) => api.post('/users', data);
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

export const fetchTeams = () => api.get('/teams');
export const createTeam = (data: any) => api.post('/teams', data);

export const fetchRoles = () => api.get('/roles');
export const createRole = (data: any) => api.post('/roles', data);

export const fetchSites = (companyId?: string) => companyId ? api.get(`/companies/${companyId}/sites`) : api.get('/sites');
export const createSite = (companyId: string, data: any) => api.post(`/companies/${companyId}/sites`, data);

export const fetchCustomFields = (module?: string) => api.get('/custom-fields', { params: { module } });
export const createCustomField = (data: any) => api.post('/custom-fields', data);
export const deleteCustomField = (id: string) => api.delete(`/custom-fields/${id}`);

export const uploadFile = async (file: File) => {
    // 1. Get presigned URL from backend
    const { data: { uploadUrl, publicUrl, fileName } } = await api.post('/upload/presigned-url', {
        fileName: file.name,
        fileType: file.type
    });

    // 2. Upload directly to R2 using the presigned URL
    // We use a clean axios instance to avoid sending our backend auth token to Cloudflare
    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type
        }
    });

    return { data: { url: publicUrl, fileName } };
};

export const loginUser = (credentials: any) => api.post('/auth/login', credentials);
export const registerUser = (data: any) => api.post('/auth/register', data);
