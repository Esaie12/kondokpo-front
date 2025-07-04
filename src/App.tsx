import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="1066567339626-c0v0ogarpenlc67obhhpplsk726kbuod.apps.googleusercontent.com">
      <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    </GoogleOAuthProvider>
  );
}



export default App;
