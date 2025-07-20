import { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Campagne } from "../../models/CampagneType";
import { campagneApi } from "../../services/campagneApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { format } from "path";


const CreateCampagne = () => {

    const dispatch = useDispatch<AppDispatch>()
    const { user, connected, error } = useSelector((state: RootState) => state.user)
    const [successMessage, setSuccessMessage] = useState("");
    const [isIllimite, setIsIllimite] = useState(false);

    const { formData, handleChange, resetForm, defaultForm } = useForm<Campagne>({
        categorie_event_id:1,
        date_evenement:'',
        titre_cagnotte:'',
        message_personnel:'',
        objectif_collecte:0,
        cause_soutenir:'',
        objectif_illimite:false,
        currency:'XOF',
        message_remerciement:''
    })
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            console.log(formData)
            await campagneApi.create(formData);
            setSuccessMessage(" Campagne crée avec succès !");

           // resetForm();

        } catch (err: any) {
            if (err.response?.status === 422) {
                console.log(err.response.data.errors)
                //setErrors(err.response.data.errors)
                //showError("Veuillez corriger les erreurs dans le formulaire")
            } else {
               // showError("Erreur lors de la création de la catégorie")
                console.error(err)
            }
        } finally {
            //setLoading(false)
        }
    }

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => {
                setSuccessMessage("");
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    {false ? (
                        <div className="card fade-in">
                            <div className="card-body p-4">
                                <h3 className="text-center mb-4">Créer ma Cagnotte Solidaire</h3>
                                {successMessage && (
                                    <div className="alert alert-success text-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                <form id="createCampaignForm" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Catégorie</label>
                                            <select className="form-control" name="categorie_event_id" value={formData.categorie_event_id} onChange={handleChange}>
                                                <option value={1}>Aide communautaire</option>
                                                <option value={2}>Mon anniversaire</option>
                                                <option value={3}>Autre occasion</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Date de l'événement</label>
                                            <input type="date" className="form-control" value={formData.date_evenement} name="date_evenement" onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Image de couverture</label>
                                        <input type="file" accept="image/*" className="form-control" name="image_couverture" onChange={handleChange} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Titre de votre cagnotte</label>
                                        <input type="text" value={formData.titre_cagnotte} className="form-control" name="titre_cagnotte" onChange={handleChange} placeholder="Ex: Pour mes 30 ans, aidons ensemble les familles en difficulté" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Votre message personnel</label>
                                        <textarea className="form-control" name="message_personnel" onChange={handleChange} rows={4} placeholder="Partagez pourquoi cette cause vous tient à cœur...">{formData.message_personnel}</textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Objectif de collecte</label>
                                            {!formData.objectif_illimite && (
                                                <>
                                                <input type="number" className="form-control" name="objectif_collecte" onChange={handleChange} placeholder="500" min="0" value={formData.objectif_collecte} />
                                                <small className="text-muted">Minimum 50€</small>
                                                </>
                                            )}
                                            
                                            <div className="form-check mt-2">
                                                <input className="form-check-input" type="checkbox" name="objectif_illimite"  onChange={handleChange} />
                                                <label className="form-check-label">
                                                    Objectif illimité ( collecter autant)
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cause à soutenir</label>
                                            <select className="form-control" name="cause_soutenir" value={formData.cause_soutenir} onChange={handleChange}>
                                                <option>Personne en difficulté</option>
                                                <option>Aide alimentaire</option>
                                                <option>Aide d'urgence</option>
                                                <option>Personnes âgées isolées</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Monnaie</label>
                                            <select className="form-control" name="currency" value={formData.currency} onChange={handleChange}>
                                                <option value="EUR">Euro (€)</option>
                                                <option value="XOF">Franc CFA (XOF)</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Message de remerciement</label>
                                            <input type="text" className="form-control" name="message_remerciement" value={formData.message_remerciement} onChange={handleChange} placeholder="Merci du fond du cœur pour votre soutien !" />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-lg">
                                            <i className="fas fa-rocket me-2"></i>Lancer ma Cagnotte
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ):(
                        <>
                        
                        <div className="alert alert-danger fade-in" role="alert">
                            <h4 className="alert-heading">Important !</h4>
                            <hr/>
                            
                            <p>Vous devez être connecté pour créer une cagnotte solidaire.Rejoignez notre communauté et commencez à transformer vos moments de joie en gestes solidaires !</p>
                            
                            <p className="mb-0">Pour vous connectez, appuyer sur le bouton Google en haut de votre écran</p>
                        </div>

                        </>
                    )}
                    
                </div>
            </div>
        </>
    )
}

export default CreateCampagne;