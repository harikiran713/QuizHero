"use client";
import React from "react";

export default function Navigation() {
  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={(e) => handleScroll(e, item.href.substring(1))}
          className="text-gray-600 hover:text-purple-600 hover:scale-110 transition-all duration-200"
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
}
