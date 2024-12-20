import { Suspense, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  GroupAddIcon,
  //   InboxIcon,
  LatestEventsIcon,
  //   NotificationIcon,
  TalkamLogo,
  //   UsersIcon,
} from "../../assets/icons/generated";
import { SideBarItem } from "../global/sidebarItem";
import { Button } from "../forms/button";
// import { NavSearch } from "../forms/navsearchbar";
import {
  useFollowingCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetUserProfileDetailsQuery,
} from "../../services/userApiSlice";
import { ColoredLoader } from "../global/loader";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../services/authSlice";
// import { Avatar } from "../global/avatar";
// import { motion } from "framer-motion";
// import { downVariants } from "../../helpers/cardanimation";
// import { UserPopUp } from "./components/userpopup";
import { useOnOutsideClick } from "../../hooks/useOnOutsideClick";
// import { Modal } from "../global/modal";
import { useResendOtpMutation } from "../../services/authApiSlice";
// import { toast } from "sonner";
// import { handleError } from "../../utils/handleError";
// import { Messages } from "../../routes/dashboard/messages/messages";
// import { DrawerModal } from "../global/drawer";
import { useGetNotificationStatsQuery } from "../../services/notificationsApiSlice";
import * as Icon from "react-feather";
import Pusher from "pusher-js";

export const HelpIfoLayout = ({ children }) => {
  let isMobile = useMediaQuery("(max-width: 1024px)");
  let isLogoMobile = useMediaQuery("(max-width: 425px)");

  const navigate = useNavigate();
  const location = useLocation();
  const isHelpAndInfo = location.pathname.includes("help&info");
  const searchParams = new URLSearchParams(location.search);
  const token = useSelector(selectCurrentToken);
  const currentUser = useSelector(selectCurrentUser);
  const popUpRef = useRef();
  const [showPanel, setShowPanel] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);

  const { data: categories, isLoading: loadingCategories } =
    useGetSubCategoriesQuery({
      sort: "popular",
      categoryId: "",
    });
  const { data: followingCategories, isLoading: followingCategoriesLoading } =
    useFollowingCategoriesQuery();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();
  const { data: user, isSuccess } = useGetUserProfileDetailsQuery(
    currentUser?.id,
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );
  const { data: notificationStats, refetch: refetchNotification } =
    useGetNotificationStatsQuery();

  useOnOutsideClick(popUpRef, () => {
    setProfileMenu(() => false);
  });

  const connectToPusher = () => {
    let pusherChannel; // Declare pusherChannel variable

    // Unsubscribe from the channel if it's already subscribed
    if (pusherChannel) {
      pusherChannel.unbind_all();
      pusher.unsubscribe("refresh-notification." + currentUser?.id);
    }

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      encrypted: true,
      authEndpoint: `${import.meta.env.VITE_BASE_API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });
    pusherChannel = pusher.subscribe("refresh-notification." + currentUser?.id); // Assign pusherChannel
    pusherChannel.bind("refresh", (data) => {
      console.log(data);
      refetchNotification();
    });
    return () => {
      pusherChannel.unbind_all();
      pusher.unsubscribe("refresh-notification." + currentUser?.id);
    };
  };

  const toggleShowPanel = () => {
    setShowPanel((prev) => !prev);
  };

  useEffect(() => {
    refetchNotification();
    if (user) {
      if (!user?.data?.email_verified_at) {
        setVerifyModal(() => true);
      }
    }
  }, [user]);

  useEffect(() => {
    connectToPusher();
  }, []);

  const activeInfoNavLinkClass = ({ isActive }) =>
    `relative transition-all duration-300 ${
      isActive
        ? "after:block after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[3px] after:bg-[#017FC8]"
        : ""
    }`;

  return (
    <Suspense fallback={<ColoredLoader />}>
      <section className="w-full flex items-center justify-center no-scrollbar">
        <main
          className={`w-full relative h-dvh no-scrollbar  no-scrollbar bg-[#FAFAFA]`}
        >
          {/* Mobile header */}
          <div className="border-b bg-white border-tgray-light w-full   flex items-center">
            <header
              className={`sticky w-full flex items-center justify-between max-w-screen-2xl h-[7dvh] mx-auto gap-8 sm:gap-4 z-40 px-[5vw] lg:px-24  py-2 top-0`}
            >
              <div
                onClick={() => {
                  navigate("/home");
                  setShowPanel(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <TalkamLogo
                  width={isMobile ? 25 : 35}
                  height={isMobile ? 30 : 40}
                />
                <p
                  className={` ${
                    !isLogoMobile ? "block" : "hidden"
                  } flex items-center text-xl font-regularNunito`}
                >
                  <span className="font-extraboldNunito">talk</span>AM
                </p>
              </div>
              {isHelpAndInfo && (
                <>
                  <section
                    className={` ${
                      isMobile ? "hidden" : "flex"
                    } justify-center items-center gap-10`}
                  >
                    <div className="*:text-sm *:text-[#212121] *:font-semibold  flex justify-center items-start gap-6">
                      <NavLink
                        to="/help&info/about"
                        className={activeInfoNavLinkClass}
                      >
                        About
                      </NavLink>
                      <NavLink
                        to="/help&info/faqs"
                        className={activeInfoNavLinkClass}
                      >
                        FAQs
                      </NavLink>
                      <NavLink
                        to="/help&info/rules"
                        className={activeInfoNavLinkClass}
                      >
                        Rules
                      </NavLink>
                      <NavLink
                        to="/help&info/feedback"
                        className={activeInfoNavLinkClass}
                      >
                        Feedback
                      </NavLink>
                    </div>
                    <Link
                      to="/home"
                      className="border border-[#017FC8] text-[#017FC8] text-base font-bold rounded-[22px] px-5 py-2"
                    >
                      Go to site
                    </Link>
                  </section>
                  <Icon.Menu
                    className={`${isMobile ? "block" : "hidden"}`}
                    width={24}
                    height={24}
                    color="black"
                    onClick={toggleShowPanel}
                    size={isMobile ? 15 : 18}
                  />
                </>
              )}
            </header>
          </div>

          <div className=" relative max-w-screen-2xl mx-auto flex no-scrollbar h-[calc(100dvh-7dvh)] ">
            <div
              className={`fixed inset-0 z-[38] backdrop-blur-sm bg-tgray-300 lg:hidden`}
              style={{
                opacity: 0.8,
                display: isMobile && showPanel ? "block" : "none",
              }}
              aria-hidden="true"
              onClick={toggleShowPanel}
            ></div>
            {isMobile && (
              <aside
                className={`fixed border-r border-tgray-light inset-y-0 z-[38] lg:absolute w-80 sm:w-96 no-scrollbar overflow-y-auto bg-white pl-[5vw] pr-6
                        ${isMobile && !showPanel && "hidden"}`}
              >
                <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
                  <nav
                    className={`flex-1 no-scrollbar ${
                      isMobile && "pt-[80px] sm:pt-[110px]"
                    } `}
                  >
                    <section className="flex flex-col items-start gap-4 sm:gap-5 border-b *:!text-sm *:sm:!text-lg border-tgray-200 pb-10 sm:pb-12">
                      <Button
                        variant="link"
                        fullWidth
                        children="Help & Support"
                        className="flex items-center justify-between  !py-0 !px-0"
                      />
                      <Button
                        variant="link"
                        fullWidth
                        children="Content policy"
                        className="flex items-center justify-between  !py-0 !px-0"
                      />

                      <Link
                        onClick={() => setShowPanel(false)}
                        className="flex items-center justify-between  !py-0 !px-0"
                        to="/help&info/about"
                      >
                        About
                      </Link>
                      <Link
                        onClick={() => setShowPanel(false)}
                        className="flex items-center justify-between  !py-0 !px-0"
                        to="/help&info/faqs"
                      >
                        FAQs
                      </Link>
                      <Link
                        onClick={() => setShowPanel(false)}
                        className="flex items-center justify-between  !py-0 !px-0"
                        to="/help&info/rules"
                      >
                        Rules
                      </Link>
                      <Link
                        onClick={() => setShowPanel(false)}
                        className="flex items-center justify-between  !py-0 !px-0"
                        to="/help&info/feedback"
                      >
                        Feedback
                      </Link>
                      <Button
                        variant="link"
                        fullWidth
                        children="Report a problem"
                        className="flex items-center justify-between  !py-0 !px-0"
                      />
                      <Link
                        onClick={() => setShowPanel(false)}
                        className="flex items-center justify-between  !py-0 !px-0"
                        to="/home"
                      >
                        Go to site
                      </Link>
                    </section>
                  </nav>
                </div>
              </aside>
            )}
            <main className={`flex-1 w-full h-full pl-0 no-scrollbar`}>
              {/* main content */}
              <div className="flex flex-col flex-1 h-full overflow-x-hidden overflow-auto no-scrollbar  body-font font-normal text-tblack-100">
                <Outlet />
              </div>
            </main>
          </div>
        </main>
      </section>
    </Suspense>
  );
};
