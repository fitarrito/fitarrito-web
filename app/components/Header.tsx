"use client";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import gsap from "gsap";
import textImage from "../images/fitarrito.svg";
import CartDrawer from "@/components/CartDrawer";
import logo from "../images/logo.svg";
import { FaShoppingCart } from "react-icons/fa";
import { useAppSelector } from "app/lib/hooks";
import { selectTotalQuantity } from "app/lib/features/cartSlice";

// Typ für einen einzelnen Menüpunkt
interface MenuItem {
  href: string;
  label: string;
}

// Liste von Menüpunkten

// Header-Komponente
const Header: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const prevScrollY = useRef(0);
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
  return (
    // Header-Element
    <header className="sticky top-0 z-50">
      <div
        ref={navRef}
        className={`fixed top-0 left-0 z-50 w-full items-center bg-white`}
      >
        {/* Hintergrund für das aufklappbare Menü */}

        <div className="flex justify-center">
          <div className=" bg-nav-color-dark w-screen justify-between  shadow-customShadow-md laptop:w-[80vw] text-white inline-flex items-center py-1 mobile:py-3 px-1 md:px-4 lg laptop:rounded-full laptop:my-4  laptop:inline-flex">
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

            <div className="z-40 flex flex-row gap-3">
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
