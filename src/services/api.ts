import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

// 🔧 Définir l'URL de base avec fallback si la variable n'est pas définie
//const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_BASE_URL: string = 'http://localhost:8000/api';


// 📦 Créer une instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 🔐 Intercepteur de requêtes pour ajouter automatiquement le token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// ❗ Intercepteur de réponses pour gestion centralisée des erreurs
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          console.warn("Non autorisé : veuillez vous reconnecter.");
          window.location.href = '/';
          break;
        case 403:
          console.warn("Accès refusé : permissions insuffisantes.");
          break;
        default:
          console.error(`Erreur ${status} :`, error.response.data);
      }
    } else {
      console.error("Erreur réseau ou serveur inaccessible :", error.message || error);
    }

    return Promise.reject(error);
  }
);

// 🚀 Exporter l'instance prête à l'emploi
export default api;
