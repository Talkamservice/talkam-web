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
  InboxIcon,
  LatestEventsIcon,
  NotificationIcon,
  TalkamLogo,
  UsersIcon,
} from "../../assets/icons/generated";
import { SideBarItem } from "../global/sidebarItem";
import { Button } from "../forms/button";
import { NavSearch } from "../forms/navsearchbar";
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
import { Avatar } from "../global/avatar";
import { motion } from "framer-motion";
import { downVariants } from "../../helpers/cardanimation";
import { UserPopUp } from "./components/userpopup";
import { useOnOutsideClick } from "../../hooks/useOnOutsideClick";
import { Modal } from "../global/modal";
import { useResendOtpMutation } from "../../services/authApiSlice";
import { toast } from "sonner";
import { handleError } from "../../utils/handleError";
import { Messages } from "../../routes/dashboard/messages/messages";
import { DrawerModal } from "../global/drawer";
import { useGetNotificationStatsQuery } from "../../services/notificationsApiSlice";
import * as Icon from "react-feather";
import Pusher from "pusher-js";

export const MainAppLayout = ({ children }) => {
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

  const verifyAccountHandler = async () => {
    try {
      const resendDetails = {
        email: currentUser?.email,
        type: "verify_email",
      };
      const response = await resendOtp(resendDetails).unwrap();
      toast.success(response.message);
      navigate("/email-verification", {
        state: { emailValue: resendDetails?.email, type: "verify_email" },
      });
    } catch (error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage);
    }
  };

  const toggleShowPanel = () => {
    setShowPanel((prev) => !prev);
  };
  const showProfileMenu = () => {
    setProfileMenu((prev) => !prev);
  };

  const toggleVerifyModal = () => {
    setVerifyModal((prev) => !prev);
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
          className={`w-full relative h-dvh no-scrollbar  no-scrollbar ${
            isHelpAndInfo ? "bg-[#FAFAFA]" : ""
          }`}
        >
          {/* Mobile header */}
          <div className="border-b bg-white border-tgray-light w-full h-[7dvh] sm:h-[8dvh] flex overflow-hidden items-center">
            <header
              className={`sticky w-full flex items-center justify-between max-w-screen-2xl mx-auto gap-8 sm:gap-4 z-40 px-[5vw] lg:px-24  py-2 top-0`}
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
                    <div className="*:text-sm *:text-[#212121] *:font-semibold  flex justify-center items-start gap-8">
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
              {!isHelpAndInfo && (
                <section className="w-10/12 md:w-9/12 flex items-center justify-end gap-6 md:gap-8 no-scrollbar">
                  <section
                    className={`${
                      isMobile ? "" : "flex-1"
                    } flex items-center gap-5 md:gap-8`}
                  >
                    {isMobile ? (
                      <Icon.Search
                        onClick={() => navigate("/search")}
                        className={`${isMobile ? "w-5 h-5" : "w-7 h-7"}`}
                      />
                    ) : (
                      <NavSearch />
                    )}
                    <NotificationIcon
                      onClick={() => navigate("/notifications")}
                      className={`cursor-pointer ${
                        isMobile ? "w-5 h-5" : "w-7 h-7"
                      }`}
                    />
                    <InboxIcon
                      onClick={() => {
                        navigate({
                          pathname: `${location.pathname}/`,
                          search: `messages`,
                        });
                        setShowPanel(false);
                      }}
                      className={`cursor-pointer ${
                        isMobile ? "w-5 h-5" : "w-7 h-7"
                      }`}
                    />
                  </section>
                  <section className="flex items-center gap-5 md:gap-8">
                    <Button
                      children={isMobile ? "" : "Post"}
                      leftIcon={<Icon.Plus size={isMobile ? 16 : 20} />}
                      className={
                        isMobile
                          ? "!rounded-full !text-base bg-tprimary-50 !p-1"
                          : "!rounded-full !text-base bg-tprimary-50 !px-4 !py-2.5"
                      }
                      onClick={() => {
                        navigate("/create-post");
                        setShowPanel(false);
                      }}
                    />
                    <div ref={popUpRef} className="cursor-pointer relative">
                      <Avatar
                        onClick={showProfileMenu}
                        src={currentUser?.avatar}
                        size={isMobile ? "xs" : "sm"}
                      />
                      {profileMenu ? (
                        <motion.div
                          variants={downVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                          className="absolute top-14 -right-12 z-40"
                        >
                          <UserPopUp
                            currentUser={currentUser}
                            toggleShowPanel={() => setShowPanel(false)}
                            close={showProfileMenu}
                          />
                        </motion.div>
                      ) : null}
                    </div>
                    <Icon.Menu
                      className={`${isMobile ? "block" : "hidden"}`}
                      width={24}
                      height={24}
                      color="black"
                      onClick={toggleShowPanel}
                      size={isMobile ? 15 : 18}
                    />
                  </section>
                </section>
              )}
            </header>
          </div>

          <div className=" relative max-w-screen-2xl mx-auto flex no-scrollbar h-[calc(100dvh-7dvh)] sm:h-[calc(100dvh-8dvh)]">
            <div
              className={`fixed inset-0 z-[38] backdrop-blur-sm bg-tgray-300 lg:hidden`}
              style={{
                opacity: 0.8,
                display: isMobile && showPanel ? "block" : "none",
              }}
              aria-hidden="true"
              onClick={toggleShowPanel}
            ></div>

            {!isHelpAndInfo || (isHelpAndInfo && isMobile) ? (
              <aside
                className={`fixed border-r border-tgray-light inset-y-0 z-[38] lg:absolute w-80 sm:w-96 no-scrollbar overflow-y-auto bg-white sm:pl-20 pr-6
                        ${isMobile && !showPanel && "hidden"}`}
              >
                <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
                  <nav
                    className={`flex-1 no-scrollbar ${isMobile && "pt-14"} `}
                  >
                    <section className="w-full flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4">
                      <h1 className="text-base font-bold">
                        Your subcategories
                      </h1>
                      <ul className="w-full flex flex-col gap-2">
                        {followingCategoriesLoading ? (
                          <section className="w-full flex items-center justify-center m-auto">
                            <ColoredLoader />
                          </section>
                        ) : (
                          followingCategories?.data
                            .slice(0, 5)
                            .map((item) => (
                              <SideBarItem
                                key={item.id}
                                children={item.name}
                                image={item.icon_image ?? <LatestEventsIcon />}
                                url={`/category/${item?.id}`}
                                onClick={() => setShowPanel(false)}
                              />
                            ))
                        )}
                      </ul>
                    </section>

                    <section className="flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4">
                      <h1 className="text-base font-bold">Groups</h1>
                      <Button
                        variant="outline"
                        fullWidth
                        children="Create group"
                        rightIcon={<GroupAddIcon />}
                        className="flex items-center justify-between text-sm !p-2 !px-3"
                        onClick={() => {
                          navigate("/create-group");
                          setShowPanel(false);
                        }}
                      />
                      <Button
                        variant="outline"
                        fullWidth
                        children="See all groups"
                        rightIcon={<Icon.ArrowRight />}
                        className="flex items-center justify-between !text-sm !p-2 !px-3 !border-none"
                        onClick={() => {
                          navigate("/groups");
                          setShowPanel(false);
                        }}
                      />
                    </section>

                    <section className="w-full flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4">
                      <h1 className="text-base font-bold">
                        Popular subcategories
                      </h1>
                      <ul className="w-full flex flex-col gap-2">
                        {loadingCategories ? (
                          <section className="w-full flex items-center justify-center m-auto">
                            <ColoredLoader />
                          </section>
                        ) : (
                          categories?.data
                            .slice(0, 5)
                            .map((item) => (
                              <SideBarItem
                                key={item.id}
                                children={item.name}
                                image={item.icon_image ?? <LatestEventsIcon />}
                                url={`/category/${item?.id}`}
                                onClick={() => setShowPanel(false)}
                              />
                            ))
                        )}
                      </ul>
                      <Button
                        variant="link"
                        fullWidth
                        children="See all categories"
                        rightIcon={<Icon.ArrowRight />}
                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                        onClick={() => {
                          navigate("/categories");
                          setShowPanel(false);
                        }}
                      />
                    </section>

                    <section className="flex flex-col items-start gap-3 border-b border-tgray-200 py-6 pl-4 pb-4">
                      <Button
                        variant="link"
                        fullWidth
                        children="Help & Support"
                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                      />
                      <Button
                        variant="link"
                        fullWidth
                        children="Content policy"
                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                      />
                      <Button
                        variant="link"
                        fullWidth
                        children="About"
                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                      />
                      <Button
                        variant="link"
                        fullWidth
                        children="Report a problem"
                        className="flex items-center justify-between !text-sm !py-0 !px-0"
                      />
                    </section>
                  </nav>
                </div>
              </aside>
            ) : (
              ""
            )}

            <main
              className={`flex-1 w-full h-full ${
                !isMobile && (isHelpAndInfo ? "pl-0" : "pl-80 sm:pl-96")
              } no-scrollbar`}
            >
              {/* main content */}
              <div className="flex flex-col flex-1 h-full overflow-x-hidden overflow-auto no-scrollbar  body-font font-normal text-tblack-100">
                <Outlet />
              </div>
            </main>
          </div>
        </main>

        <Modal
          show={verifyModal}
          shouldCloseOnEscPress={false}
          shouldCloseOnOverlayClick={false}
          onClose={toggleVerifyModal}
          position="center"
          contentWidth="w-full md:w-2/5"
        >
          <div className="p-6 flex items-center flex-col gap-4">
            <header className="w-full border-b border-tgray-50 flex items-center gap-2 py-1">
              <Icon.AlertCircle color="#FF0000" />
              <p className="w-full text-base font-bold ">Verify Email</p>
            </header>
            Kindly Verify your email to continue
            <Button
              onClick={verifyAccountHandler}
              isLoading={resendLoading}
              disabled={resendLoading}
            >
              Continue to verification
            </Button>
          </div>
        </Modal>

        <DrawerModal
          show={location.search.includes("messages")}
          shouldCloseOnEscPress={false}
          onClose={() => navigate(-1)}
          contentWidth="w-full lg:w-9/12"
        >
          <Messages />
        </DrawerModal>
      </section>
    </Suspense>
  );
};
