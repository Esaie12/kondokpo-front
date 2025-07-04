import { useState, useEffect } from 'react';
import { campagneApi } from '../../services/campagneApi';
import '../../stylesCss/monCss.css';

interface DashboardStat {
    campagne:number,
    collecte:number,
    personne_aide:number
}
const Welcome = () => {

    const [dashboard, setDashboard] = useState<DashboardStat>({
        campagne: 0,
        collecte: 0,
        personne_aide: 0
    });

    useEffect(() => {

        const fetchStats = async () => {
            try {
                const retour_api = await campagneApi.getDashboardStat()
                setDashboard(retour_api)

            } catch (err) {
                console.error("Erreur lors du chargement des catégories :", err)
            }
        }
        fetchStats()
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-lg-8">
                    <div className="card fade-in">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">Comment ça marche ?</h3>
                            <div className="row">
                                <div className="col-md-6 text-center mb-4">
                                    <div className="feature-icon">
                                        <i className="fas fa-birthday-cake"></i>
                                    </div>
                                    <h5>1. Créez votre occasion</h5>
                                    <p className="text-muted">Anniversaire, mariage, fête... transformez votre événement en moment solidaire</p>
                                </div>
                                 <div className="col-md-6 text-center mb-4">
                                    <div className="feature-icon">
                                        <i className="fas fa-hand-holding-heart"></i>
                                    </div>
                                    <h5>1. Nous validons votre cagnotte</h5>
                                    <p className="text-muted">Pour s'assurer que toutes les conditions sont réunis nous examinons votre cagnotte.</p>
                                </div>
                                <div className="col-md-6 text-center mb-4">
                                    <div className="feature-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <h5>3. Partagez avec vos proches</h5>
                                    <p className="text-muted">Invitez famille et amis à contribuer à votre cagnotte solidaire</p>
                                </div>
                               
                                <div className="col-md-6 text-center mb-4">
                                    <div className="feature-icon">
                                        <i className="fas fa-hand-holding-heart"></i>
                                    </div>
                                    <h5>4. Aidez ensemble</h5>
                                    <p className="text-muted">Les fonds collectés sont redistribués aux personnes en difficulté</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="stats-card fade-in">
                        <div className="stats-number">{dashboard.personne_aide}</div>
                        <div className="stats-label">Personnes aidées</div>
                    </div>
                    <div className="stats-card fade-in">
                        <div className="stats-number">€{dashboard.collecte}</div>
                        <div className="stats-label">Fonds collectés</div>
                    </div>
                    <div className="stats-card fade-in">
                        <div className="stats-number">{dashboard.campagne}</div>
                        <div className="stats-label">Cagnottes créées</div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Welcome;