


import { User } from '../models/UserType';
import api from './api'; // Assure-toi que ton instance Axios est aussi typée !

// Définir les interfaces
export interface RegisterData {
    name: string;
    email: string;
    password: string,
    [key: string]: any; // optionnel si tu as d'autres champs
}

export interface LoginCredentials {
    email: string;
    password: string;
}


export interface AuthResponse {
    message:string,
    token: string;
    user: User;
}

export interface ProfileParams {
    [key: string]: any;
}

export interface LogoutParams {
    [key: string]: any;
}

// Endpoints typés
const authEndpoints = {
    

    loginOrRegister: (credentials: User): Promise<AuthResponse> => {
        return api.post<AuthResponse>('/auth/google', credentials).then(({ data }) => {
            console.log("🟢 Réponse API reçue :", data);

            if (data) {
                localStorage.setItem('token', JSON.stringify(data.token));
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        });
    },

    /*
    getProfile: (params: ProfileParams) => {
        return api.get<{ data: any }>('/profile', { params }).then(({ data }) => data);
    },

    completeProfil: (profileData: Partial<AuthResponse['user']>) => {
        return api.post<AuthResponse>('/complete-profil', profileData).then(({ data }) => {
            if (data?.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        });
    },*/

    logout: (params: LogoutParams) => {
        return api.post('/auth/logout', { params }).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        });
    }
    
};

export default authEndpoints;
