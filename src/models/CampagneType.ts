import { CategoryEventType } from "./CategoryEventType";
import { TransactionCampagne } from "./TransactionType";
import { User } from "./UserType";

export interface Campagne {
    id?:number,
    slug?:string
    categorie_event_id: number,
    date_evenement:string,
    titre_cagnotte:string,
    message_personnel:string,
    objectif_collecte:number,
    amount_collect?:number,
    cause_soutenir:string,
    objectif_illimite:boolean
    currency: 'EUR'|'XOF',
    message_remerciement:string
    created_at?: string,
    user?:User
    categorie_event?:CategoryEventType
    transactions? : TransactionCampagne[]
}