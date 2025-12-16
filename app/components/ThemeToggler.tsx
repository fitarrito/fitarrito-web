import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
    setIsActive(!isActive);
  };

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div
      onClick={toggleTheme}
      className={`
       relative w-16 h-8 flex items-center dark:bg-customTheme bg-teal-500 cursor-pointer rounded-full p-1`}
    >
      <FaMoon className="fill-white w-[15px] h-[15px]"></FaMoon>
      <div
        id="toggleBtnTheme"
        className={` bg-white
        absolute  w-6 h-6 rounded-full shadow-customShadow-md ${
          resolvedTheme === "dark"
            ? " transition-transform translate-x-0"
            : " transition-transform translate-x-8"
        }`}
      ></div>
      <FaSun className="fill-white w-[15px] h-[15px] ml-auto"></FaSun>
    </div>
  );
};

export default ThemeToggler;
