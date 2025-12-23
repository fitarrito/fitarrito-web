"use client";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import gsap from "gsap";
import textImage from "../images/fitarrito.svg";
import CartDrawer from "@/components/CartDrawer";
import logo from "../images/logo.svg";
import { FaShoppingCart, FaUser, FaChevronDown } from "react-icons/fa";
import { useAppSelector } from "app/lib/hooks";
import { selectTotalQuantity } from "app/lib/features/cartSlice";
import { useAuth } from "../lib/hooks/useAuth";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { User } from "@supabase/supabase-js";

// Typ für einen einzelnen Menüpunkt
interface MenuItem {
  href: string;
  label: string;
}

// Liste von Menüpunkten

// Helper function to get user display name
const getUserDisplayName = (user: User | null): string => {
  if (!user) return "User";
  try {
    // Check both user_metadata and raw_user_meta_data
    const metadata =
      user.user_metadata ||
      (user as User & { raw_user_meta_data?: Record<string, unknown> })
        .raw_user_meta_data;
    if (metadata?.name) {
      return String(metadata.name);
    }
    if (user.email) {
      return user.email.split("@")[0];
    }
  } catch (error) {
    console.error("Error getting user display name:", error);
  }
  return "User";
};

// Helper function to get user initial for avatar
const getUserInitial = (user: User | null): string => {
  try {
    const name = getUserDisplayName(user);
    return name.charAt(0).toUpperCase();
  } catch (error) {
    console.error("Error getting user initial:", error);
    return "U";
  }
};

// Header-Komponente
const Header: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const prevScrollY = useRef(0);
  const { signOut, user, isAuthenticated, loading: authLoading } = useAuth();

  // Debug: Check if user exists
  useEffect(() => {
    console.log("Header: Auth state check", {
      hasUser: !!user,
      isAuthenticated,
      authLoading,
      userEmail: user?.email,
      userName: user?.user_metadata?.name,
      userMetadata: user?.user_metadata,
      session: user ? "exists" : "null",
    });
  }, [user, isAuthenticated, authLoading]);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(() => {
    // GSAP animation for fade in on mount
    gsap.set(navRef.current, { autoAlpha: 1 });

    gsap.from(navRef.current, {
      autoAlpha: 0,
      duration: 0.5,
      delay: 0.5,
      ease: "power4.out",
    });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isTop = currentScrollY < 50;
      const isScrollingDown = currentScrollY > prevScrollY.current;
      const hideNavbar = currentScrollY > 500;

      // Set the navbar background based on scroll position

      if (isTop) {
        gsap.to(navRef.current, {
          autoAlpha: 1,
          ease: "power1.out",
          duration: 0.6,
        });
      } else {
        gsap.to(navRef.current, {
          autoAlpha: 1,
          ease: "power1.out",
          duration: 0.6,
        });

        // After a certain amount of scroll, hide or show the navbar based on the direction
        if (hideNavbar) {
          gsap.to(navRef.current, {
            yPercent: isScrollingDown ? -100 : 0,
            autoAlpha: isScrollingDown ? 0 : 1,
            ease: "power3.out",
            duration: 2,
          });
        }
      }

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      gsap.killTweensOf(navRef.current);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);
  return (
    // Header-Element
    <header className="sticky top-0 z-50">
      <div
        ref={navRef}
        className={`fixed top-0 left-0 z-50 w-full items-center bg-white`}
      >
        {/* Hintergrund für das aufklappbare Menü */}

        <div className="flex justify-center">
          <div
            className=" bg-nav-color-dark w-screen justify-between  shadow-customShadow-md laptop:w-[80vw] text-white inline-flex items-center py-1 mobile:py-3 px-1 md:px-4 lg laptop:rounded-full laptop:my-4  laptop:inline-flex overflow-visible"
            style={{ overflow: "visible" }}
          >
            <div className="flex items-center">
              <div>
                <Link
                  href="/"
                  className=" transition ease-in-out duration-150  px-3 py-1 justify-center mobile:px-3 mobile:py-2 rounded-xl text-xs mobile:text-base min-w-[50px] mobile:w-[50px]  flex"
                >
                  <Image src={logo} alt="UTP-Logo" width={55} height={55} />
                </Link>
              </div>
              <div>
                <Link
                  href="/"
                  className=" transition ease-in-out duration-150  px-3 py-1 justify-center mobile:px-3 mobile:py-2 rounded-xl text-xs mobile:text-base  mobile:w-[100px] flex"
                >
                  <Image
                    src={textImage}
                    alt="UTP-Logo"
                    width={130}
                    height={90}
                  />
                </Link>
              </div>
            </div>

            <div
              className="z-40 flex flex-row gap-3 items-center overflow-visible"
              style={{ overflow: "visible", minWidth: "fit-content" }}
            >
              {/* Always show profile section if user exists */}
              {/* Show profile if user exists, or if we're still loading (to avoid flicker) */}
              {!authLoading && user ? (
                <>
                  {/* Profile Section with Dropdown */}
                  <div
                    className="relative"
                    ref={profileDropdownRef}
                    data-testid="profile-section"
                    style={{
                      display: "block",
                      visibility: "visible",
                      opacity: 1,
                      position: "relative",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                      className="px-3 py-2 rounded-3xl flex flex-row items-center gap-2 text-white text-sm font-medium transition-colors hover:bg-white/20 relative z-50 min-w-fit bg-white/20 border border-white/40"
                      aria-label="User profile menu"
                      data-testid="profile-button"
                      style={{
                        display: "flex",
                        visibility: "visible",
                        opacity: 1,
                        minWidth: "fit-content",
                        width: "auto",
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      {/* Profile Icon/Avatar */}
                      <div
                        className="px-3 py-2 rounded-3xl flex items-center gap-2
text-gray-900 bg-customTheme border border-white-500 hover:bg-gray-500 transition"
                        style={{
                          minWidth: "32px",
                          minHeight: "32px",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          className="text-gray-900 text-xs font-bold"
                          style={{
                            color: "#ffffff",
                            display: "inline-block",
                            lineHeight: "1",
                          }}
                        >
                          {user ? getUserInitial(user) : "U"}
                        </span>
                      </div>
                      {/* Profile Name */}
                      <span
                        className="text-white text-sm font-semibold whitespace-nowrap"
                        style={{
                          color: "#000000",
                          display: "inline-block",
                          lineHeight: "1.5",
                        }}
                      >
                        {user ? getUserDisplayName(user) : "User"}
                      </span>
                      <FaChevronDown
                        className={`text-white text-sm transition-transform flex-shrink-0 ${
                          showProfileDropdown ? "rotate-180" : ""
                        }`}
                        style={{
                          color: "#ffffff",
                          display: "block",
                          flexShrink: 0,
                        }}
                        // aria-hidden="true"
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user ? getUserDisplayName(user) : "User"}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="px-4 py-2 bg-customTheme hover:bg-primary-700 rounded-3xl flex flex-row items-center gap-2 text-white text-sm font-medium transition-colors"
                >
                  <FaUser className="text-white text-base" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
              <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-2 bg-customTheme rounded-3xl flex flex-row items-center justify-between w-16"
              >
                <FaShoppingCart className="text-white text-lg" />
                <p className="text-white text-sm fontWeight-bold">
                  {totalQuantity}
                </p>
              </button>

              {/* <ThemeToggler /> */}
            </div>
          </div>
        </div>

        {/* Aufklappbares Menü */}
      </div>
      {isOpen ? <CartDrawer isOpen={isOpen} setIsOpen={setIsOpen} /> : null}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={signOut}
      />
    </header>
  );
};

// Einzelner Menüpunkt
const MenuItem: React.FC<MenuItem> = ({ href, label }) => {
  const { theme } = useTheme();
  //   <div
  //   className={`-z-50 absolute h-screen w-screen bg-bg-color-dark/20 transition duration-300  ${
  //     menuActive ? "flex" : "hidden"
  //   }`}
  // ></div>
  //   <div className="flex gap-3 laptop:hidden max-mobile:pr[10%] z-10">
  //   <button
  //     id="nav-menu"
  //     className={`laptop:hover:text-custom-purple transition duration-200 ${
  //       menuActive ? "text-custom-purple" : "#000"
  //     }`}
  //     onClick={toggleNavbar}
  //   >
  //     <IoMdMenu className="w-[30px] size-8" color="red" />
  //   </button>
  // </div>
  //   <div className="laptop:inline-flex bg-gradient-to-b from-nav-color-dark/70 to-nav-color-dark/20 border-[#000]/10 rounded-b-xl min-h-0 transition-[height] duration-300 laptop:bg-none laptop:h-[auto] laptop:backdrop-blur-none z-50 laptop:shadow-none hidden">
  //   <nav className="my-auto">
  //     <ul className="text-center laptop:flex gap-10 text-white laptop:w-auto">
  //       {/* Menüpunkte */}
  //       {menuItems.map((menuItem, index) => (
  //         <MenuItem key={index} {...menuItem} />
  //       ))}
  //       {/* Dropdown-Menü */}
  //     </ul>
  //   </nav>
  // </div>
  //   <div
  //   className={` laptop:bg-none laptop:h-[auto] laptop:backdrop-blur-none z-50 laptop:shadow-none laptop:hidden ${
  //     menuActive
  //       ? "h-[240px] shadow-xl overflow-clip"
  //       : "h-[0px] shadow-none overflow-clip"
  //   }`}
  //   style={{ maxHeight: menuActive ? "block" : "hidden" }}
  // >
  //   <nav className="my-auto">
  //     <ul className="text-center laptop:flex gap-4 text-white laptop:w-auto">
  //       {/* Menüpunkte */}
  //       {menuItems.map((menuItem, index) => (
  //         <MenuItem key={index} {...menuItem} />
  //       ))}
  //     </ul>
  //   </nav>
  // </div>
  return (
    <li
      className={`py-3 ${
        theme === "dark" ? "hover:bg-red-400" : "hover:bg-red-700"
      } laptop:py-0 transition ease-in-out duration-150 laptop:hover:bg-transparent laptop:text-lg laptop:text-red-900`}
    >
      <Link
        href={href}
        className={`${theme === "dark" ? "text-white-900" : "text-black"}`}
      >
        {label}
      </Link>
    </li>
  );
};

export default Header;
