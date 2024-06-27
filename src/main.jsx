import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './app/store';
import ErrorPage from './routes/error/error';
import Protected from './utils/protected';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';

const router =  createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true,
        loader: () => redirect('home'),
      },
      {
        path: 'home',
        async lazy(){
          let { Home } = await import("./routes/dashboard/home");
          return { Component: Home }
        }
      }
    ]
  },
  { 
    path: 'login',
    async lazy() {
      let { Login } = await import("./routes/auth/login/login");
      return { Component: Login };
    },
  },
  {
    path: 'recover-password',
    async lazy() {
      let { Recovery } = await import("./routes/auth/recovery/recovery");
      return { Component: Recovery };
    }
  },
  {
    path: 'recover-password/mail',
    async lazy() {
      let { MailSuccess } = await import("./routes/auth/recovery/mailsuccess");
      return { Component: MailSuccess };
    }
  },
  {
    path: 'password-reset',
    async lazy() {
      let { PasswordReset } = await import("./routes/auth/recovery/passwordreset");
      return { Component: PasswordReset };
    }
  },
  {
    path: 'sign-up',
    async lazy() {
      let { SignUp } = await import("./routes/auth/signup/signup");
      return { Component: SignUp };
    },
  },
  {
    path: 'email-verification',
    async lazy() {
      let { Verification } = await import("./routes/auth/signup/verification");
      return { Component: Verification };
    }
  },
  {
    path: '/get-started/interests',
    async lazy() {
      let { Interests } = await import("./routes/onboarding/interests");
      return { Component: Interests };
    },
  },
  {
    path: '/get-started/save-profile',
    async lazy() {
      let { SaveProfile } = await import("./routes/onboarding/saveprofile");
      return { Component: SaveProfile };
    },
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>  
      <Provider store={store}>
        <AnimatePresence mode='wait'>
          <RouterProvider router={router} />
        </AnimatePresence>
      </Provider>
    </GoogleOAuthProvider>
    <Toaster richColors position="bottom-center" />
  </React.StrictMode>,
)
