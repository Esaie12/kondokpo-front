import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../stylesCss/monCss.css';
import { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../models/UserType';
import authEndpoints from '../../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { loginStart, loginSuccess, loginFailure, logout } from '../../features/userSlice';

const Template = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()
    const { user, connected, error } = useSelector((state: RootState) => state.user)

    const [showDropdown, setShowMenuDrop] = useState(false);

    //Connexion avec google
    const handleLoginSuccess = (credentialResponse: any) => {
        if (credentialResponse.credential) {
            const decoded: any = jwtDecode(credentialResponse.credential);
           
            const userProfile = {
                google_id: decoded.sub,
                email: decoded.email,
                email_verified_at: decoded.email_verified,
                name: decoded.name,
                first_name: decoded.given_name,
                last_name: decoded.family_name,
                profile_picture: decoded.picture,
                last_login: new Date().toISOString()
            };
           // console.log("✅ Utilisateur connecté :", userProfile);
            saveUserProfile(userProfile);
        }
    };

    const saveUserProfile = async (userProfile: User) => {
        dispatch(loginStart())

        try {
            const retour = await authEndpoints.loginOrRegister(userProfile);
            //console.log("✅ Réponse :", res);
            const connectedUser = retour.user

            setTimeout(() => {
                dispatch(loginSuccess(connectedUser))
                //showSuccess(`Bienvenue ${connectedUser.name} !`)

                // Rediriger vers la page demandée ou vers le dashboard
                const from = location.state?.from?.pathname || "/"
                navigate(from, { replace: true })
            }, 300)

        }catch (err: any) {
            dispatch(loginFailure("Échec de la connexion"))
            //showError("Email ou mot de passe incorrect")
            console.error("Erreur lors de la connexion :", err)
        } finally {
            //setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            console.log("De connex")
            await authEndpoints.logout({});
            dispatch(logout())
            setShowMenuDrop(false)

        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        } finally {
            // 🔐 Supprimer les données locales
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirection vers la page de connexion
            navigate("/campagnes");
        }
    };

   

    return (
        <>
            <div className="floating-hearts">
                <div className="heart"><i className="fas fa-heart"></i></div>
            </div>

            <div className="container-fluid">
                <div className="main-container">
                    <div className="header-section">
                        <div className="auth-buttons">
                            {!connected ? (
                                <>
                                <GoogleLogin 
                                    onSuccess={handleLoginSuccess}
                                    onError={() => {
                                    console.log("❌ Échec de la connexion");
                                }} />
                                </>
                            ):(
                                <>
                                <div className="profile-dropdown">
                                    <button className="btn-profile" id="profileBtn" onClick={() => setShowMenuDrop(!showDropdown)} >
                                        <i className="fas fa-user"></i>
                                    </button>
                                    {showDropdown && (
                                        <div className="dropdown-menu-custom show" id="profileDropdown">
                                            <a href="#" className="dropdown-item-custom">
                                                <i className="fas fa-user-circle"></i>
                                                Mon Profil
                                            </a>
                                            <a href="#" className="dropdown-item-custom">
                                                <i className="fas fa-cog"></i>
                                                Paramètres
                                            </a>
                                            <a href="#" className="dropdown-item-custom">
                                                <i className="fas fa-heart"></i>
                                                Mes Campagnes
                                            </a>
                                            <div className="dropdown-divider-custom"></div>
                                            <a href="#"  onClick={(e) => { e.preventDefault(); setShowMenuDrop(false);  handleLogout(); }}  className="dropdown-item-custom" >
                                                <i className="fas fa-sign-out-alt"></i>
                                                Se Déconnecter
                                            </a>

                                        </div>
                                    )}

                                </div>
                                </>
                            )}
                        </div>

                        <div className="header-content">
                            <h1 className="hero-title">Plateforme Kondokpo</h1>
                            <p className="hero-subtitle">Transformez vos moments de joie en gestes solidaires</p>

                            <ul className="nav nav-tabs" id="mainTabs">
                                <li className="nav-item">
                                    <NavLink to="/" className={({ isActive }) =>`nav-link ${isActive ? "active" : ""}`  }  id="home-tab">
                                      <i className="fas fa-home me-2"></i>Accueil
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/campagne/create" className={({ isActive }) =>`nav-link ${isActive ? "active" : ""}`  }  id="home-tab">
                                      <i className="fas fa-plus-circle me-2"></i>Créer une Cagnotte
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/campagnes" className={({ isActive }) =>`nav-link ${isActive ? "active" : ""}`  }  id="home-tab">
                                        <i className="fas fa-heart me-2"></i>Campagnes Actives
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="content-section">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Template;
