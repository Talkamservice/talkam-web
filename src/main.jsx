import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence } from "framer-motion";
import { HelpIfoLayout } from "./components/layout/helpInfoLayout";
import ErrorPage from "./routes/error/error";
import App from "./App";
import NotFound from "./routes/notfound/404";
import { Search } from "./routes/dashboard/search/search";

window.addEventListener("vite:preloadError", (event) => {
  window.location.reload();
});

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <App />,
    children: [
      {
        index: true,
        loader: () => redirect("home"),
      },
      {
        path: "home",
        lazy: async () => {
          let { Home } = await import("./routes/dashboard/home/home");
          return { Component: Home };
        },
        children: [
          {
            index: true,
            loader: () => redirect("new"),
          },
          {
            path: "featured",
            lazy: async () => {
              let { Featured } = await import(
                "./routes/dashboard/home/tabs/featured"
              );
              return { Component: Featured };
            },
          },
          {
            path: "trending",
            lazy: async () => {
              let { Trending } = await import(
                "./routes/dashboard/home/tabs/trending"
              );
              return { Component: Trending };
            },
          },
          {
            path: "new",
            lazy: async () => {
              let { New } = await import("./routes/dashboard/home/tabs/new");
              return { Component: New };
            },
          },
        ],
      },
      {
        path: "ads",
        lazy: async () => {
          let { Ads } = await import("./routes/dashboard/ads/ads");
          return { Component: Ads };
        },
        children: [
          {
            index: true,
            loader: () => redirect("running-ads"),
          },
          {
            path: "running-ads",
            lazy: async () => {
              let { RunningAds } = await import(
                "./routes/dashboard/ads/runningads"
              );
              return { Component: RunningAds };
            },
          },
          {
            path: "closed-ads",
            lazy: async () => {
              let { ClosedAds } = await import(
                "./routes/dashboard/ads/closedads"
              );
              return { Component: ClosedAds };
            },
          },
        ],
      },
      {
        path: "create-post",
        lazy: async () => {
          let { CreatePost } = await import(
            "./routes/dashboard/create post/createpost"
          );
          return { Component: CreatePost };
        },
      },
      {
        path: "/inbox",
        lazy: async () => {
          let { Messages } = await import(
            "./routes/dashboard/messages/messages"
          );
          return { Component: Messages };
        },
      },
      {
        path: "pricing",
        lazy: async () => {
          let { Pricing } = await import("./routes/dashboard/pricing/pricing");
          return { Component: Pricing };
        },
      },
      {
        path: "userprofile/:userId",
        children: [
          {
            lazy: async () => {
              let { Profile } = await import(
                "./routes/dashboard/userprofile/userprofile"
              );
              return { Component: Profile };
            },
            children: [
              {
                index: true,
                loader: () => redirect("posts"),
              },
              {
                path: "posts",
                lazy: async () => {
                  let { ProfilesPosts } = await import(
                    "./routes/dashboard/userprofile/profileposts"
                  );
                  return { Component: ProfilesPosts };
                },
              },
              {
                path: "comments",
                lazy: async () => {
                  let { ProfileComments } = await import(
                    "./routes/dashboard/userprofile/profilecomments"
                  );
                  return { Component: ProfileComments };
                },
              },
              {
                path: "upvotes",
                lazy: async () => {
                  let { ProfileUpvotes } = await import(
                    "./routes/dashboard/userprofile/profileupvotes"
                  );
                  return { Component: ProfileUpvotes };
                },
              },
              {
                path: "media",
                lazy: async () => {
                  let { ProfileMedia } = await import(
                    "./routes/dashboard/userprofile/profilemedia"
                  );
                  return { Component: ProfileMedia };
                },
              },
            ],
          },
        ],
      },
      {
        path: "settings",
        lazy: async () => {
          let { ProfileSettings } = await import(
            "./routes/dashboard/settings/profilesettings"
          );
          return { Component: ProfileSettings };
        },
        children: [
          {
            index: true,
            loader: () => redirect("account"),
          },
          {
            path: "account",
            lazy: async () => {
              let { AccountSettings } = await import(
                "./routes/dashboard/settings/account"
              );
              return { Component: AccountSettings };
            },
          },
          {
            path: "profile-notifications",
            lazy: async () => {
              let { ProfileNotificationSettings } = await import(
                "./routes/dashboard/settings/notificationsettings"
              );
              return { Component: ProfileNotificationSettings };
            },
          },
          {
            path: "privacy",
            lazy: async () => {
              let { PrivacySettings } = await import(
                "./routes/dashboard/settings/privacysettings"
              );
              return { Component: PrivacySettings };
            },
          },
          {
            path: "blocked-users",
            lazy: async () => {
              let { BlockedUserSettings } = await import(
                "./routes/dashboard/settings/blockedusers"
              );
              return { Component: BlockedUserSettings };
            },
          },
        ],
      },
      {
        path: "comment/:commentId",
        lazy: async () => {
          let { Comment } = await import("./routes/dashboard/coment/comment");
          return { Component: Comment };
        },
      },
      {
        path: "promo/:adId",
        lazy: async () => {
          let { AdDetails } = await import("./routes/dashboard/ads/addetails");
          return { Component: AdDetails };
        },
      },
      {
        path: "notifications",
        lazy: async () => {
          let { Notifications } = await import(
            "./routes/dashboard/notifications/notifications"
          );
          return { Component: Notifications };
        },
        children: [
          {
            index: true,
            loader: () => redirect("post"),
          },
          {
            path: "post",
            lazy: async () => {
              let { PostNotifications } = await import(
                "./routes/dashboard/notifications/postnotifications"
              );
              return { Component: PostNotifications };
            },
          },
          {
            path: "conversation",
            lazy: async () => {
              let { ConversationNotifications } = await import(
                "./routes/dashboard/notifications/conversationnotifications"
              );
              return { Component: ConversationNotifications };
            },
          },
          {
            path: "admin",
            lazy: async () => {
              let { SystemAdmin } = await import(
                "./routes/dashboard/notifications/systemadmin"
              );
              return { Component: SystemAdmin };
            },
          },
        ],
      },
      {
        path: "groups",
        lazy: async () => {
          let { Groups } = await import("./routes/dashboard/groups/groups");
          return { Component: Groups };
        },
        children: [
          {
            index: true,
            loader: () => redirect("recents"),
          },
          {
            path: "recents",
            lazy: async () => {
              let { RecentGroups } = await import(
                "./routes/dashboard/groups/recentgroups"
              );
              return { Component: RecentGroups };
            },
          },
          {
            path: "explore",
            lazy: async () => {
              let { ExploreGroups } = await import(
                "./routes/dashboard/groups/exploregroups"
              );
              return { Component: ExploreGroups };
            },
          },
        ],
      },
      {
        path: "create-group",
        lazy: async () => {
          let { CreateGroup } = await import(
            "./routes/dashboard/groups/creategroup"
          );
          return { Component: CreateGroup };
        },
      },
      {
        path: "categories",
        lazy: async () => {
          let { Categories } = await import(
            "./routes/dashboard/categories/categories"
          );
          return { Component: Categories };
        },
      },
      {
        path: "category/:subCategoryId",
        lazy: async () => {
          let { Category } = await import(
            "./routes/dashboard/category/category"
          );
          return { Component: Category };
        },
        children: [
          {
            index: true,
            loader: () => redirect("new"),
          },
          {
            path: "featured",
            lazy: async () => {
              let { CategoryFeatured } = await import(
                "./routes/dashboard/category/tabs/categoryfeatured"
              );
              return { Component: CategoryFeatured };
            },
          },
          {
            path: "trending",
            lazy: async () => {
              let { CategoryTrending } = await import(
                "./routes/dashboard/category/tabs/trending"
              );
              return { Component: CategoryTrending };
            },
          },
          {
            path: "new",
            lazy: async () => {
              let { CategoryJustIn } = await import(
                "./routes/dashboard/category/tabs/justin"
              );
              return { Component: CategoryJustIn };
            },
          },
        ],
      },
      {
        path: "group/:groupId",
        lazy: async () => {
          let { Group } = await import("./routes/dashboard/group/group");
          return { Component: Group };
        },
        children: [
          {
            index: true,
            loader: () => redirect("posts"),
          },
          {
            path: "posts",
            lazy: async () => {
              let { GroupPosts } = await import(
                "./routes/dashboard/group/groupposts"
              );
              return { Component: GroupPosts };
            },
          },
          {
            path: "media",
            lazy: async () => {
              let { GroupMedia } = await import(
                "./routes/dashboard/group/groupmedia"
              );
              return { Component: GroupMedia };
            },
          },
          // {
          //   path: "featured",
          //   lazy: async () => {
          //     let { GroupFeatured } = await import(
          //       "./routes/dashboard/group/groupfeatured"
          //     );
          //     return { Component: GroupFeatured };
          //   },
          // },
          // {
          //   path: "trending",
          //   lazy: async () => {
          //     let { GroupTrending } = await import(
          //       "./routes/dashboard/group/grouptrending"
          //     );
          //     return { Component: GroupTrending };
          //   },
          // },
          // {
          //   path: "new",
          //   lazy: async () => {
          //     let { GroupLatest } = await import(
          //       "./routes/dashboard/group/grouplatest"
          //     );
          //     return { Component: GroupLatest };
          //   },
          // },
        ],
      },
      {
        path: "search",
        // lazy: async () => {
        //   let { Search } = await import("./routes/dashboard/search/search");
        //   return { Component: Search };
        // },

        //used the direct component and not the dynamic import cause it delays the users input on search cause the module is not downloaded yet...
        element: <Search />,
        children: [
          {
            index: true,
            loader: () => redirect("posts"),
          },
          {
            path: "posts",
            lazy: async () => {
              let { SearchPosts } = await import(
                "./routes/dashboard/search/searchposts"
              );
              return { Component: SearchPosts };
            },
          },
          {
            path: "groups",
            lazy: async () => {
              let { SearchGroup } = await import(
                "./routes/dashboard/search/searchgroups"
              );
              return { Component: SearchGroup };
            },
          },
          {
            path: "media",
            lazy: async () => {
              let { SearchMedia } = await import(
                "./routes/dashboard/search/searchmedia"
              );
              return { Component: SearchMedia };
            },
          },
        ],
      },
    ],
  },

  {
    path: "/help&info",
    errorElement: <ErrorPage />,
    element: <HelpIfoLayout />,
    children: [
      {
        path: "about",
        lazy: async () => {
          let { About } = await import("./routes/dashboard/HomeInfo/about");
          return { Component: About };
        },
      },
      {
        path: "faqs",
        lazy: async () => {
          let { Faqs } = await import("./routes/dashboard/HomeInfo/faqs");
          return { Component: Faqs };
        },
      },
      {
        path: "terms",
        lazy: async () => {
          let { Terms } = await import("./routes/dashboard/HomeInfo/terms");
          return { Component: Terms };
        },
      },
      {
        path: "rules",
        lazy: async () => {
          let { Rules } = await import("./routes/dashboard/HomeInfo/rules");
          return { Component: Rules };
        },
      },
      {
        path: "privacy-policy",
        lazy: async () => {
          let { Privacy } = await import("./routes/dashboard/HomeInfo/privacy");
          return { Component: Privacy };
        },
      },
      {
        path: "payment-terms",
        lazy: async () => {
          let { PaymentTerms } = await import(
            "./routes/dashboard/HomeInfo/paymentTerms"
          );
          return { Component: PaymentTerms };
        },
      },
      {
        path: "feedback",
        lazy: async () => {
          let { Feedback } = await import(
            "./routes/dashboard/HomeInfo/feedback"
          );
          return { Component: Feedback };
        },
      },
      {
        path: "faqs/:name",
        lazy: async () => {
          let { AccordionPage } = await import(
            "./routes/dashboard/HomeInfo/accordionPage"
          );
          return { Component: AccordionPage };
        },
      },
    ],
  },
  {
    path: "login",
    lazy: async () => {
      let { Login } = await import("./routes/auth/login/login");
      return { Component: Login };
    },
  },
  {
    path: "join-waitlist",
    lazy: async () => {
      let { WaitlistPage } = await import("./components/layout/waitlist");
      return { Component: WaitlistPage };
    },
  },
  {
    path: "recover-password",
    lazy: async () => {
      let { Recovery } = await import("./routes/auth/recovery/recovery");
      return { Component: Recovery };
    },
  },
  {
    path: "recover-password/mail",
    lazy: async () => {
      let { MailSuccess } = await import("./routes/auth/recovery/mailsuccess");
      return { Component: MailSuccess };
    },
  },
  {
    path: "password-reset",
    lazy: async () => {
      let { PasswordReset } = await import(
        "./routes/auth/recovery/passwordreset"
      );
      return { Component: PasswordReset };
    },
  },
  {
    path: "sign-up",
    lazy: async () => {
      let { SignUp } = await import("./routes/auth/signup/signup");
      return { Component: SignUp };
    },
  },
  {
    path: "email-verification",
    errorElement: <ErrorPage />,
    lazy: async () => {
      let { Verification } = await import("./routes/auth/signup/verification");
      return { Component: Verification };
    },
  },
  {
    path: "/get-started/interests",
    lazy: async () => {
      let { Interests } = await import("./routes/onboarding/interests");
      return { Component: Interests };
    },
  },
  {
    path: "/get-started/save-profile",
    lazy: async () => {
      let { SaveProfile } = await import("./routes/onboarding/saveprofile");
      return { Component: SaveProfile };
    },
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AnimatePresence mode="wait">
          <RouterProvider router={router} />
        </AnimatePresence>
      </Provider>
    </GoogleOAuthProvider>
    <Toaster richColors position="bottom-center" />
  </React.StrictMode>
);
