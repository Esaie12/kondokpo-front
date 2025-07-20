import { useEffect, useState } from "react";
import { campagneApi } from "../../services/campagneApi";
import { Campagne } from "../../models/CampagneType";
import CardCampagne from "../component/CardCampagne";

const ListeCampagne = () => {
    const [campagnes, setCampagnes] = useState<Campagne[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const campagnes_api = await campagneApi.getAll();
                setCampagnes(campagnes_api);
            } catch (err) {
                console.error("Erreur lors du chargement des catégories :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Cagnottes Actives</h1>
                <p className="page-subtitle">Découvrez les projets solidaires en cours et contribuez à faire la différence</p>
            </div>

            <div className="campaigns-grid">
                {loading ? (
                    <div className="text-center my-5">Chargement en cours...</div>
                ):(
                    <>
                    {campagnes.map((camp) => (
                        <CardCampagne key={camp.id} campagne={camp} />
                    ))}
                    </>
                )}
            </div>
        </>
    );
};

export default ListeCampagne;
