import { NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

import logo from "@/Assets/COMMON/logon.png";
import logoinvert from "@/Assets/COMMON/logoinvert.png";

const navLinks = [
  { label: "The 2026 Concert", path: "/concerts" },
  { label: "About", path: "/about" },
  { label: "Community", path: "/community" },
  { label: "Booking", path: "/booking" },
  { label: "Media", path: "/media" },
  { label: "UMA", path: "/umafoundation" },
  { label: "Shop", path: "https://store.desifest.ca", external: true },
];

export default function Navbar({ textcolour }) {
  const [open, setOpen] = useState(false);

  const finalColor = textcolour || "white";
  const useInvert = !!textcolour;

  return (
    <header
      className="absolute top-0 left-0 w-full z-50 bg-transparent"
      style={{ color: finalColor }}
    >
      <nav className="w-full px-6 md:px-28 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img
            src={useInvert ? logoinvert : logo}
            alt="DESIFEST"
            className="h-16 w-auto"
          />
        </NavLink>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          
          {/* Hamburger */}
          <button
            className="cursor-pointer"
            style={{ color: finalColor }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>

          {/* 2026 */}
          <NavLink
            to="/concerts"
            className="bg-neon-yellow text-black font-medium px-3 md:px-5 py-2 md:text-2xl oswaldd hover:opacity-90 transition hover:bg-lime-300"
          >
            2026
          </NavLink>

          {/* MERCH */}
          <a
            href="https://store.desifest.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neon-yellow text-black font-medium px-3 md:px-5 py-2 md:text-2xl oswaldd hover:opacity-90 transition hover:bg-lime-300"
          >
            MERCH
          </a>
        </div>
      </nav>

      {/* Side Navigation Menu */}
      {open && (
        <div
          className="backdrop-blur-md px-6 py-6 space-y-4 shadow-2xl"
          style={{
            backgroundColor: "rgba(16, 4, 34, 0.98)",
          }}
        >
          {navLinks.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-lg oswaldd uppercase tracking-wide"
                style={{ color: "white" }}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className="block text-lg oswaldd uppercase tracking-wide"
                style={{ color: "white" }}
              >
                {item.label}
              </NavLink>
            )
          )}
        </div>
      )}
    </header>
  );
}
