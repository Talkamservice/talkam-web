import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './app/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';
import { MainAppLayout } from './components/layout/mainapp';
import ErrorPage from './routes/error/error';
import Protected from './utils/protected';

const router =  createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <MainAppLayout />,
    children: [
      {
        index: true,
        loader: () => redirect('home'),
      },
      {
        path: 'home',
        lazy: async () => {
          let { Home } = await import("./routes/dashboard/home/home");
          return { Component: Home };
        },
        children: [
          {
            index: true,
            loader: () => redirect('featured')
          },
          {
            path: 'featured',
            lazy: async () => {
              let { Featured } = await import("./routes/dashboard/home/featured");
              return { Component: Featured };
            }
          },
          {
            path: 'trending',
            lazy: async () => {
              let { Trending } = await import("./routes/dashboard/home/trending");
              return { Component: Trending };
            }
          },
          {
            path: 'new',
            lazy: async () => {
              let { New } = await import("./routes/dashboard/home/new");
              return { Component: New };
            }
          }
        ]
      },
      {
        path: 'create-post',
        lazy: async () => {
          let { CreatePost } = await import("./routes/dashboard/create post/createpost");
          return { Component: CreatePost };
        }
      },
      {
        path: 'comment/:commentId',
        lazy: async () => {
          let { Comment } = await import("./routes/dashboard/coment/comment");
          return { Component: Comment };
        }
      }
    ]
  },
  { 
    path: 'login',
    lazy: async () => {
      let { Login } = await import("./routes/auth/login/login");
      return { Component: Login };
    },
  },
  {
    path: 'recover-password',
    lazy: async () => {
      let { Recovery } = await import("./routes/auth/recovery/recovery");
      return { Component: Recovery };
    }
  },
  {
    path: 'recover-password/mail',
    lazy: async () => {
      let { MailSuccess } = await import("./routes/auth/recovery/mailsuccess");
      return { Component: MailSuccess };
    }
  },
  {
    path: 'password-reset',
    lazy: async () => {
      let { PasswordReset } = await import("./routes/auth/recovery/passwordreset");
      return { Component: PasswordReset };
    }
  },
  {
    path: 'sign-up',
    lazy: async () => {
      let { SignUp } = await import("./routes/auth/signup/signup");
      return { Component: SignUp };
    },
  },
  {
    path: 'email-verification',
    lazy: async () => {
      let { Verification } = await import("./routes/auth/signup/verification");
      return { Component: Verification };
    }
  },
  {
    path: '/get-started/interests',
    lazy: async () => {
      let { Interests } = await import("./routes/onboarding/interests");
      return { Component: Interests };
    },
  },
  {
    path: '/get-started/save-profile',
    lazy: async () => {
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
