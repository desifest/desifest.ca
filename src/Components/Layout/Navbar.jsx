import { NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "@/Assets/COMMON/logon.png";

const navLinks = [
  { label: "The 2026 Concert", path: "/concerts" },
  { label: "About", path: "/about" },
  { label: "Community", path: "/community" },
  { label: "Booking", path: "/booking" },
  { label: "Media", path: "/media" },
  { label: "UMA", path: "/umafoundation" },
  { label: "Shop", path: "https://store.desifest.ca", external: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative w-full z-80 bg-[#2C223C] backdrop-blur-md">
      <nav className="w-full px-6 md:px-28 py-4 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img src={logo} alt="DESIFEST" className="h-16 w-auto" />
        </NavLink>

        {/* Right Section */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Hamburger (mobile and desktop) */}
          <button
            className="text-white cursor-pointer"
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

      {/* Mobile/Side Navigation Menu */}
      {open && (
        <div className="bg-[#100422]/95 backdrop-blur-md px-6 py-6 space-y-4">
          {navLinks.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-white text-lg oswaldd uppercase tracking-wide"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setOpen(false)}
                className="block text-white text-lg oswaldd uppercase tracking-wide"
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
