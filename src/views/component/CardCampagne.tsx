import { Link } from "react-router-dom";
import { Campagne } from "../../models/CampagneType";
import { getProgressPercentage } from "../../utils/functions";

type Props = {
    campagne: Campagne
}

const CardCampagne = ({ campagne }: Props) => {

    return (
        <>

            <div className="campaign-card">
                <div className="card-header">
                    <div className="card-badge">{campagne.categorie_event?.title}</div>
                    <div className="heart-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                </div>
                <div className="card-body">
                    <h3 className="campaign-title">
                        <Link to={`/campagnes/${campagne.slug}`} style={{ textDecoration: "none" }} >{campagne.titre_cagnotte}</Link>
                    </h3>
                    <p className="campaign-author">Par {campagne.user?.first_name} {campagne.user?.last_name.charAt(0) + '.'}</p>

                    <p className="ampaign-description">
                        {campagne.message_personnel
                            ? campagne.message_personnel.slice(0, 100) +
                            (campagne.message_personnel.length > 100 ? "..." : "")
                            : ""}
                    </p>
                    <div className="progress-section">
                        <div className="progress-info">
                            <span className="progress-percentage">{getProgressPercentage(campagne.amount_collect!, campagne.objectif_collecte)}%</span>
                            <span className="progress-time">12 jours restants</span>
                        </div>
                        {/*<div className="progress-bar">
                            <div className="progress-fill" style={{ width: "63%" }}></div>
                        </div>*/}
                        {campagne && (campagne.amount_collect ?? 0) ? (
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: getProgressPercentage(campagne.amount_collect!, campagne.objectif_collecte) + "%"
                                    }}
                                ></div>
                            </div>
                        ) : (
                            <>
                                <span className="text-primary mb-2" >Soyez le premier et obtenez un kdo</span>
                            </>
                        )}
                    </div>
                    {/*<div className="progress-stats">
                        <div className="stat">
                            <span className="stat-value">€{campagne.amount_collect}</span>
                            <span className="stat-label">collectés</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">€{campagne.objectif_collecte}</span>
                            <span className="stat-label">objectif</span>
                        </div>
                    </div>*/}
                    <div className="card-actions">
                        <a href="#" className="btn btn-primary">Contribuer</a>
                        <a href="#" className="btn btn-secondary">Partager</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardCampagne;