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
import { closeMobileMenu, toggleMobileMenu } from '../../stylesJs/monJs';

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

        } catch (err: any) {
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
            <header className="mobile-header">
                <div className="mobile-header-content">
                    <div className="mobile-logo">Kondokpo</div>
                    <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            <div className="mobile-page-header">
                <h1 className="mobile-page-title">Cagnottes Actives</h1>
                <p className="mobile-page-subtitle">Découvrez les projets solidaires en cours et contribuez à faire la différence</p>
            </div>

            <div className="mobile-overlay" onClick={closeMobileMenu}></div>

            <nav className="nav-sidebar">
                <div className="nav-logo">
                    <div className="logo">Kondokpo</div>
                    <div className="tagline">Solidarité & Joie</div>
                </div>
                <ul className="nav-items">
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) =>`nav-link ${isActive ? "active" : ""}`  }  id="home-tab">
                            <svg className="nav-icon" viewBox="0 0 24 24">
                                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                            </svg>
                            Accueil
                        </NavLink>
                    </li>
                    
                    <li className="nav-item">
                        <NavLink to="/campagnes" className={({ isActive }) =>`nav-link ${isActive ? "active" : ""}`  }  id="home-tab">
                            <svg className="nav-icon" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            Cagnottes Actives
                        </NavLink>
                    </li>
                    
                    {connected && (
                        <>
                        <li className="nav-item">
                            <NavLink to="/campagne/create" className={({ isActive }) =>`nav-link ${isActive ? "active" : ""}`  }  id="home-tab">
                                <svg className="nav-icon" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Créer une Cagnotte
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <svg className="nav-icon" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                                Mon Profil
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link">
                                <svg className="nav-icon" viewBox="0 0 24 24">
                                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                                </svg>
                                Dashboard
                            </a>
                        </li>
                        </>
                    )}
                    
                </ul>
            </nav>

            <main className="main-content">
                <Outlet/>
            </main>
        </>
    )
}
export default Template;
