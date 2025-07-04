import { Link } from "react-router-dom";
import { Campagne } from "../../models/CampagneType";
import { getProgressPercentage } from "../../utils/functions";

type Props = {
    campagne: Campagne
}

const CardCampagne = ({campagne}: Props) => {

    return (
        <div className="modern-campaign-card fade-in">
            <div className="campaign-header-modern">
                <div className="campaign-avatar">
                    <i className="fas fa-heart"></i>
                </div>
                <div className="campaign-meta">
                    {/*<span className="campaign-category">{campagne.categorie_event?.title}</span>*/}
                    <span className="campaign-status active">{campagne.categorie_event?.title}</span>
                </div>
            </div>

            <div className="campaign-content">
                <h3 className="campaign-title-modern">
                    <Link to={`/campagnes/${campagne.slug}`} style={{textDecoration:"none"}} >{campagne.titre_cagnotte}</Link>
                </h3>
                <p className="campaign-author">Par {campagne.user?.first_name} {campagne.user?.last_name.charAt(0)+'.'} </p>
                <p className="campaign-desc">
                    {campagne.message_personnel
                    ? campagne.message_personnel.slice(0, 100) + 
                    (campagne.message_personnel.length > 100 ? "..." : "")
                    : ""}
                </p>

                <div className="progress-container">
                    <div className="progress-info">
                        <span className="progress-percentage">{getProgressPercentage(campagne.amount_collect!, campagne.objectif_collecte)}%</span>
                        <span className="progress-time">12 jours restants</span>
                    </div>
                    {campagne && (campagne.amount_collect ?? 0) ? (
                        <div className="progress-bar-modern">
                            <div
                                className="progress-fill"
                                style={{
                                    width: getProgressPercentage(campagne.amount_collect!, campagne.objectif_collecte) + "%"
                                }}
                            ></div>
                        </div>
                    ):(
                        <>
                        <span className="text-primary mb-2" >Soyez le premier et obtenez un kdo</span>
                        </>
                    )}

                    
                    <div className="progress-stats">
                        <div className="stat">
                            <span className="stat-value">€{campagne.amount_collect}</span>
                            <span className="stat-label">collectés</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">€{campagne.objectif_collecte}</span>
                            <span className="stat-label">objectif</span>
                        </div>
                        {/*<div className="stat">
                            <span className="stat-value">-</span>
                            <span className="stat-label">contributeurs</span>
                        </div>*/}
                    </div>
                </div>
            </div>

            <div className="campaign-actions">
                <div className="quick-amounts">
                    <span className="quick-amount" data-amount="10">10€</span>
                    <span className="quick-amount" data-amount="25">25€</span>
                    <span className="quick-amount selected" data-amount="50">50€</span>
                </div>
                <div className="action-buttons">
                    <button className="btn-contribute">
                        <i className="fas fa-heart me-2"></i>Contribuer
                    </button>
                    <button className="btn-share-modern">
                        <i className="fas fa-share-alt"></i>
                    </button>
                    <button className="btn-more">
                        <i className="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardCampagne;