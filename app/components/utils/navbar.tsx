import { MouseEvent } from "react";
import HoverLinks from "@/app/components/utils/HoverLinks";
import "../styles/Navbar.css";
import Block from "./Block";
import { scrollToSection } from "@/app/components/util/navScroll";

const NAV_LINKS = [
  { label: "CAREER", href: "#experience" },
  { label: "ABOUT", href: "#skills" },
  { label: "WORK", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
] as const;

const Navbar = () => {
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget.getAttribute("data-href");
    if (target) scrollToSection(target);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    scrollToSection("#hero");
  };

  return (
    <>
      <div className="header flex justify-between items-start">
        <a
          href="/#"
          className="navbar-title navbar-logo"
          data-cursor="disable"
          onClick={handleLogoClick}
        >
          <Block />
        </a>

        <a
          href="mailto:aftabdev108@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          aftabdev108@gmail.com
        </a>
        <ul>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a data-href={href} href={href} onClick={handleNavClick}>
                <HoverLinks text={label} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
