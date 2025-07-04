// src/api/categoryApi.ts
import { Campagne } from "../models/CampagneType"
import { TransactionCampagne } from "../models/TransactionType"
import api from "./api" // ton instance Axios



export const campagneApi = {

  getDashboardStat: () => api.get(`/dashboard`).then((res) => res.data),

  getAll: () => api.get(`/campagnes`).then((res) => res.data),

  create: (formData: Campagne) => api.post("/campagnes", formData).then((res) => res.data),

  getOne: (slug: string) => api.get(`/campagnes/${slug}`).then((res) => res.data),


  update: (id: number, formData: Campagne) => api.put(`/campagnes/${id}`, formData).then((res) => res.data),

  delete: (id: number) => {
    console.log(`API: Suppression de la catégorie avec ID: ${id}`)
    return api.delete(`/campagnes/${id}`).then((res) => res.data)
  },

  doPayment : (formData: TransactionCampagne) => api.post(`/transactions`, formData).then((res) => res.data),

  getTransactionDetail: (slug: string, transaction_id: string) => api.get(`/transactions/${transaction_id}`).then((res) => res.data),

}
