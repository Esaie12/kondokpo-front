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
        <div className="page-header">
            <h1 className="page-title">Je suis reconnaissant</h1>
            <p className="page-subtitle">Une initiative pour exprimer notre gratitude</p>
        </div>

        <div className="campaign-details">
            <div className="campaign-main">
                <div className="campaign-header">
                    <div className="campaign-badge">Aide Communautaire</div>
                    <div className="campaign-heart">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>
                    <h2 className="campaign-title">Je suis reconnaissant</h2>
                    <p className="campaign-author">Par Esaie Akambi O.</p>
                </div>
                <div className="campaign-body">
                    <div className="campaign-description">
                        Une initiative pour exprimer notre gratitude envers la communauté. Ensemble, nous pouvons créer un impact positif et durable pour ceux qui nous entourent.
                    </div>

                    <div className="campaign-progress">
                        <div className="progress-info">
                            <span className="progress-percentage">63%</span>
                            <span className="progress-time">12 jours restants</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                        <div className="progress-stats">
                            <span>Objectif: 5 000 000 FCFA</span>
                            <span>Collecté: 3 150 000 FCFA</span>
                            <span>Contributeurs: 128</span>
                        </div>
                    </div>

                    <div className="campaign-actions">
                        <a href="#" className="btn btn-primary">Contribuer maintenant</a>
                        <a href="#" className="btn btn-secondary">Partager</a>
                    </div>

                    <div className="campaign-story">
                        <h3 className="story-title">L'histoire derrière cette cagnotte</h3>
                        <div className="story-content">
                            <p>Cette cagnotte a été créée dans le but de rassembler notre communauté autour d'un projet commun de gratitude et de solidarité. Nous croyons fermement que chaque petit geste compte et que, ensemble, nous pouvons faire une réelle différence dans la vie de ceux qui nous entourent.</p>
                            
                            <p>L'idée est née d'un constat simple : dans notre quotidien, nous croisons des personnes qui, par leur dévouement, leur gentillesse ou leur travail, rendent nos vies meilleures sans toujours recevoir la reconnaissance qu'elles méritent. Ce sont des enseignants passionnés, des soignants dévoués, des bénévoles engagés ou simplement des voisins attentionnés.</p>
                            
                            <p>Les fonds collectés serviront à organiser une grande journée de reconnaissance communautaire où nous pourrons honorer ces personnes et leur offrir des marques concrètes de notre gratitude. Une partie des fonds sera également utilisée pour soutenir des projets locaux qui améliorent la vie de notre communauté.</p>
                            
                            <p>Votre contribution, quelle que soit sa taille, est précieuse. Elle représente bien plus qu'une somme d'argent - c'est un geste de reconnaissance, un acte de solidarité et une manière de dire "merci" à ceux qui font la différence.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="campaign-sidebar">
                <div className="donation-card">
                    <h3 className="donation-title">Faire un don</h3>
                    <div className="donation-amounts">
                        <button className="amount-btn">1 000 FCFA</button>
                        <button className="amount-btn">2 500 FCFA</button>
                        <button className="amount-btn">5 000 FCFA</button>
                        <button className="amount-btn">10 000 FCFA</button>
                        <button className="amount-btn selected">25 000 FCFA</button>
                        <button className="amount-btn">50 000 FCFA</button>
                    </div>
                    <div className="custom-amount">
                        <input type="number" placeholder="Autre montant"/>
                        <span>FCFA</span>
                    </div>
                    <button className="btn btn-primary donate-btn">Faire un don</button>
                </div>

                <div className="supporters-card">
                    <h3 className="supporters-title">Derniers contributeurs</h3>
                    <div className="supporter">
                        <div className="supporter-avatar">MK</div>
                        <div className="supporter-info">
                            <div className="supporter-name">Marc Kouamé</div>
                            <div className="supporter-amount">25 000 FCFA</div>
                        </div>
                        <div className="supporter-time">Il y a 2h</div>
                    </div>
                    <div className="supporter">
                        <div className="supporter-avatar">AD</div>
                        <div className="supporter-info">
                            <div className="supporter-name">Aïcha Diallo</div>
                            <div className="supporter-amount">10 000 FCFA</div>
                        </div>
                        <div className="supporter-time">Il y a 5h</div>
                    </div>
                    <div className="supporter">
                        <div className="supporter-avatar">JT</div>
                        <div className="supporter-info">
                            <div className="supporter-name">Jean Toussaint</div>
                            <div className="supporter-amount">50 000 FCFA</div>
                        </div>
                        <div className="supporter-time">Il y a 1j</div>
                    </div>
                    <div className="supporter">
                        <div className="supporter-avatar">FB</div>
                        <div className="supporter-info">
                            <div className="supporter-name">Fatou Bamba</div>
                            <div className="supporter-amount">15 000 FCFA</div>
                        </div>
                        <div className="supporter-time">Il y a 1j</div>
                    </div>
                    <div className="supporter">
                        <div className="supporter-avatar">PK</div>
                        <div className="supporter-info">
                            <div className="supporter-name">Paul Konan</div>
                            <div className="supporter-amount">30 000 FCFA</div>
                        </div>
                        <div className="supporter-time">Il y a 2j</div>
                    </div>
                    <div className="view-all">
                        <a href="#">Voir tous les contributeurs (128)</a>
                    </div>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default ShowCampagne;