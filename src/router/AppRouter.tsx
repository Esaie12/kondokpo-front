import { Routes, Route } from "react-router-dom"
import NotFound from "../views/NotFound"
import Welcome from "../views/pages/Welcome"
import Template from "../views/layouts/Template"
import CreateCampagne from "../views/pages/CreateCampagne"
import ListeCampagne from "../views/pages/ListeCampagne"
import ShowCampagne from "../views/pages/ShowCampagne"
import PaymentStatut from "../views/pages/PaymentStatut"



const AppRouter = () => {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            
            <Route element={<Template/>} >
                <Route index element={<Welcome />} />
                <Route path="campagne/create" element={<CreateCampagne />} />
                <Route path="campagnes" element={<ListeCampagne />} />
                
                <Route path="campagnes/:slug" element={<ShowCampagne />} />
                <Route path="payment/:transaction_id/:slug" element={<PaymentStatut />} />

            </Route>
            
        </Routes>
    )
}

export default AppRouter