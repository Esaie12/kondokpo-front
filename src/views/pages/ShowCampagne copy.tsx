import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../stylesCss/showCampagne.css';
import { useState, useEffect, useMemo } from 'react';
import { Campagne } from '../../models/CampagneType';
import { campagneApi } from '../../services/campagneApi';
import { FedaCheckoutButton, FedaCheckoutContainer } from 'fedapay-reactjs';
import { TransactionCampagne } from '../../models/TransactionType';
import { useForm } from '../../hooks/useForm';
import ProgressCircle from '../component/ProgressCircle';
import { formatDateToFrench, getDaysRemaining } from '../../utils/functions';

type FedaPayResponse = {
  reason: string;
  transaction?: any;
};


const ShowCampagne = () => {

    const navigate = useNavigate()
    const { slug } = useParams<{ slug: string }>();
    const [campagne, setCampagne] = useState<Campagne>();
    const [selectedAmount, setSelectedAmount] = useState<number | "custom">(50);
    const [customAmount, setCustomAmount] = useState<number>(5);

    const actualAmount = selectedAmount === "custom" ? customAmount : selectedAmount;

    const amounts = [10, 25, 50, 100];

    const PUBLIC_KEY = 'pk_sandbox_1hYzcnzfd-mw7uRRNaZCOQIp';
    
    const checkoutButtonOptions = useMemo(() => ({
        public_key: PUBLIC_KEY,
        transaction: {
            amount: actualAmount,
            description: 'Participation à une cagnotte'
        },
        currency: {
            iso: 'XOF'
        },
        button: {
            class: 'btn btn-donate',
            text: ' <i className="fas fa-gift me-2"></i> Payez '+actualAmount+' €'
        },
        onComplete(resp: FedaPayResponse) {
            const FedaPay = (window as any)['FedaPay'];
            if (resp.reason === FedaPay.DIALOG_DISMISSED) {
                console.log('Vous avez fermé la boite de dialogue');
            } else {
                console.log('Transaction terminée: ' + resp.reason);

                let retour = resp.transaction;
                if(slug && retour.approved_at){
                    console.log("Transaction entrain d'etre enregistrée")
                    
                    const transaction: TransactionCampagne = {
                        campagne_id_slug:slug,
                        campagne_id: 1, // supposé venir de `useParams`
                        amount: actualAmount,
                        customer_firstname: retour.metadata.paid_customer.firstname,
                        customer_lastname: retour.metadata.paid_customer.lastname,
                        customer_email: retour.metadata.paid_customer.email,
                        transaction_key: retour.transaction_key,
                        operator: 'fedapay',
                        message: 'Merci pour votre projet !'
                    };

                    sendTransactionFedapay(transaction);

                    setTimeout(() => {
                        navigate("/payment/"+retour.transaction_key+"/"+slug);
                    }, 500);
                }

                if (FedaPay && FedaPay.Dialog && typeof FedaPay.Dialog.close === 'function') {
                    FedaPay.Dialog.close();
                }
            }
            console.log(resp.transaction);
        }
    }), [actualAmount,slug]); 
  
    

    const handleAmountClick = (amount: number | "custom") => {
        setSelectedAmount(amount);
        if (amount !== "custom") {
        setCustomAmount(amount); // Optionnel : reset customAmount si on revient à un montant fixe
        }
    };

    useEffect(() => {
        if (!slug) return;

        const fetchCampagne = async () => {
            try {
                const campagne_api = await campagneApi.getOne(slug)
                setCampagne(campagne_api)
            } catch (err) {
                console.error("Erreur lors du chargement des catégories :", err)
            }
        }

        if(slug){
            fetchCampagne()
        }
    }, [])

    

    const sendTransactionFedapay = async (transaction : TransactionCampagne)=>{
        if (!slug) return;
        try {
            
            let data =await campagneApi.doPayment(transaction)
            setCampagne(data.campagne);
            
        } catch (err) {
            console.error("Erreur lors de l'enregistrement de la transaction :", err)
        }
        
    }


    return (
        <>
            
            <Link to={'/campagnes'} >
                <button className="back-btn">
                    <i className="fas fa-arrow-left me-2"></i>Retour
                </button>
            </Link>

            <div className="container">


                <div className="main-card fade-in">
                    <div className="campaign-header">
                        <div className="campaign-icon">
                            <i className="fas fa-heart"></i>
                        </div>
                        <h1 className="campaign-title">{campagne?.titre_cagnotte}</h1>
                        <p className="campaign-creator">Par {campagne?.user?.first_name} {campagne?.user?.last_name.charAt(0)+'.'}</p>
                        <div className="d-flex justify-content-center">
                            <div className='me-3' >
                                • Créée { campagne?.created_at ? (
                                    formatDateToFrench( campagne.created_at)
                                ):(
                                    <>---</>
                                )}
                            </div>
                            <div>
                                • Termine le { campagne?.date_evenement ? (
                                formatDateToFrench( campagne.date_evenement)
                            ):(
                                <>---</>
                            )}
                            </div>
                        </div>
                    </div>

                    <div className="campaign-body">
                        {/* 
                        {(campagne && campagne?.amount_collect)&&(
                            <ProgressCircle collected={campagne.amount_collect} goal={campagne.objectif_collecte} />
                        )}
                        */}

                        
                        
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-number">€{campagne?.amount_collect}</div>
                                <div className="stat-label">Collectés</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">€{campagne?.objectif_collecte}</div>
                                <div className="stat-label">Objectif</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{ campagne?.transactions?.length }</div>
                                <div className="stat-label">Donateurs</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">
                                    {campagne ?(
                                        <>{getDaysRemaining(campagne?.date_evenement)} </>
                                    ):(
                                        <>--</>
                                    )}
                                </div>
                                <div className="stat-label">Jours restants</div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-7">
                                <div className="campaign-description">
                                    <h4><i className="fas fa-heart text-danger me-2"></i>Pourquoi cette cagnotte ?</h4>
                                    <p>{campagne?.message_personnel}</p>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="donation-section">
                                    <h4>Contribuer à cette cagnotte</h4>
                                    <p className="text-muted">Choisissez votre montant ou saisissez un montant personnalisé</p>

                                    <div className="donation-amounts">
                                        {amounts.map((amount) => (
                                        <span
                                            key={amount}
                                            className={`amount-btn ${selectedAmount === amount ? "selected" : ""}`}
                                            onClick={() => handleAmountClick(amount)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {amount}€
                                        </span>
                                        ))}
                                        <span
                                        className={`amount-btn ${selectedAmount === "custom" ? "selected" : ""}`}
                                        onClick={() => handleAmountClick("custom")}
                                        style={{ cursor: "pointer" }}
                                        >
                                        Autre
                                        </span>
                                    </div>

                                    {selectedAmount === "custom" && (
                                        <div className="custom-amount" style={{ marginTop: "10px" }}>
                                        <input
                                            type="number"
                                            className="form-control d-inline-block"
                                            style={{ width: "120px" }}
                                            placeholder="Montant"
                                            min={5}
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(Number(e.target.value))}
                                        />
                                        <span className="ms-2">€</span>
                                        </div>
                                    )}

                                    <div>
                                        <FedaCheckoutButton  key={actualAmount}  options={ checkoutButtonOptions } />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {campagne?.transactions && campagne?.transactions.length > 0 && (
                <div className="transactions-section fade-in">
                    <div className="transactions-header">
                        <h3 className="transactions-title">
                            <i className="fas fa-history me-2"></i>Historique des contributions
                        </h3>
                    </div>
                    {campagne?.transactions && campagne?.transactions.length > 0 && (
                        campagne.transactions.map((trans)=>(
                            <>
                            <div className="transaction-item">
                                <div className="transaction-avatar">{ trans.customer_firstname[0].toUpperCase()}{trans.customer_lastname[0].toUpperCase()}</div>
                                <div className="transaction-details">
                                    <div className="transaction-name">{trans.customer_firstname} {trans.customer_lastname}</div>
                                    <div className="transaction-time">
                                        { trans.created_at ? (
                                            formatDateToFrench( trans.created_at)
                                        ):(
                                            <>---</>
                                        )}
                                    </div>
                                    {/*<div className="transaction-message">"Joyeux anniversaire Sarah ! Belle initiative 🎂"</div>*/}
                                </div>
                                <div className="transaction-amount">+{trans.amount}€</div>
                            </div>
                            </>
                        ))
                    )}
                </div>
                )}
            </div>
            
        </>
    )
}

export default ShowCampagne;