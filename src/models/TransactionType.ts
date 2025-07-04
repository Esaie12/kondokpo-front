export interface TransactionCampagne {
    campagne_id:number,
    campagne_id_slug:string,
    amount:number,
    customer_firstname:string,
    customer_lastname:string,
    customer_email:string,
    transaction_key:string,
    operator: 'stripe'|'paypal'|'fedapay'|'kkiapay',
    message:string,
    created_at?:string
}