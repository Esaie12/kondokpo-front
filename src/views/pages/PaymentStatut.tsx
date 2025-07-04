import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../stylesCss/pay.css';
import { useState, useEffect } from 'react';
import { Campagne } from '../../models/CampagneType';
import { campagneApi } from '../../services/campagneApi';
import { TransactionCampagne } from '../../models/TransactionType';
import { formatDateToFrench, getProgressPercentage } from '../../utils/functions';


const PaymentStatut = () => {

    const navigate = useNavigate()
    const { slug } = useParams<{ slug: string }>();
    const { transaction_id } = useParams<{ transaction_id: string }>();

    const [campagne, setCampagne] = useState<Campagne>();
    const [transaction, setTransaction] = useState<TransactionCampagne>();
    
    useEffect(() => {
        if (!slug || !transaction_id) return;

        const fetchCampagne = async () => {
            try {
                const campagne_api = await campagneApi.getTransactionDetail(slug, transaction_id )
                setCampagne(campagne_api.campagne)
                setTransaction(campagne_api.transaction)

            } catch (err) {
                console.error("Erreur lors du chargement des catégories :", err)
            }
        }

        if (slug) {
            fetchCampagne()
        }
    }, [])
    

    return (
        <>
            <Link to={'/campagnes/'+slug} >
                <button className="back-btn">
                    <i className="fas fa-arrow-left me-2"></i>Retour
                </button>
            </Link>

            <div className="container">
                <div className="success-header">
                    <div className="success-icon">
                        <i className="fas fa-check"></i>
                    </div>
                    <h1 className="success-title">Paiement confirmé !</h1>
                    <p className="success-subtitle">Merci pour votre générosité</p>
                </div>

                <div className="info-cards">
                    <div className="info-card">
                        <div className="info-item">
                            <span className="info-label">Nom</span>
                            <span className="info-value">{campagne?.titre_cagnotte}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Organisateur</span>
                            <span className="info-value">{campagne?.user?.first_name} {campagne?.user?.last_name.charAt(0)+'.'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Montant collecté</span>
                            <span className="info-value amount-highlight">€{campagne?.amount_collect}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Objectif</span>
                            <span className="info-value">€{campagne?.objectif_collecte}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Progression</span>
                           <span className="info-value">
                                {campagne ? (
                                    `${getProgressPercentage(campagne.amount_collect!, campagne.objectif_collecte)}%`
                                ) : (
                                    <>--%</>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-header">
                            <div className="card-icon payment-icon">
                                <i className="fas fa-credit-card"></i>
                            </div>
                            <h3 className="card-title">Paiement effectué</h3>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Montant payé</span>
                            <span className="info-value amount-highlight">€ {transaction?.amount} </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Date</span>
                            <span className="info-value">
                                { transaction?.created_at ? (
                                    formatDateToFrench( transaction.created_at)
                                ):(
                                    <>---</>
                                )}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Référence</span>
                            <span className="info-value">{transaction?.transaction_key}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Statut</span>
                            <span className="info-value" style={{ color: "var(--success-bright);" }}>
                                <i className="fas fa-check-circle me-1"></i>Vérifié
                            </span>
                        </div>
                        <div className="action-buttons">
                            <button className="btn btn-download">
                                <i className="fas fa-download me-2"></i>Télécharger la facture
                            </button>
                        </div>
                    </div>
                </div>

                <div className="suggestions-section">
                    <h3 className="suggestions-title">Continuez à faire la différence</h3>
                    <div className="suggestion-cards">
                        <div className="suggestion-card">
                            <div className="suggestion-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h4 className="suggestion-title">Invitez vos proches</h4>
                            <p className="suggestion-text">
                                Partagez cette belle initiative avec votre famille et vos amis pour amplifier l'impact solidaire.
                            </p>
                        </div>

                        <div className="suggestion-card">
                            <div className="suggestion-icon">
                                <i className="fas fa-heart"></i>
                            </div>
                            <h4 className="suggestion-title">Créez votre cagnotte</h4>
                            <p className="suggestion-text">
                                Inspiré par cette démarche ? Lancez votre propre cagnotte solidaire pour une cause qui vous tient à cœur.
                            </p>
                        </div>

                        <div className="suggestion-card">
                            <div className="suggestion-icon">
                                <i className="fas fa-bell"></i>
                            </div>
                            <h4 className="suggestion-title">Suivez les actualités</h4>
                            <p className="suggestion-text">
                                Recevez des nouvelles de cette cagnotte et découvrez comment votre contribution fait la différence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentStatut;