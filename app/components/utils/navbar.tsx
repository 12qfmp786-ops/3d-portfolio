import { MouseEvent } from "react";
import HoverLinks from "@/app/components/utils/HoverLinks";
import "../styles/Navbar.css";
import Block from "./Block";
import { scrollToSection } from "@/app/components/util/navScroll";

const RESUME_URL =
  "https://drive.google.com/file/d/1oyzL94yw-HH31GBICnaUXWWECfBsDrik/view?usp=drive_link";

const NAV_LINKS = [
  { label: "ABOUT", href: "#skills" },
  { label: "CAREER", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
  { label: "RESUME", href: RESUME_URL, external: true },
] as const;

const Navbar = () => {
  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    external?: boolean
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget.getAttribute("data-href");
    if (!target) return;

    if (external) {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }

    scrollToSection(target);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    scrollToSection("#hero");
  };

  return (
    <>
      <div className="header">
        <a
          href="/#"
          className="navbar-title navbar-logo"
          data-cursor="disable"
          onClick={handleLogoClick}
        >
          <Block />
        </a>
        <ul>
          {NAV_LINKS.map(({ label, href, ...link }) => (
            <li key={href}>
              <a
                data-href={href}
                href={href}
                {...("external" in link && link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                onClick={(event) =>
                  handleNavClick(
                    event,
                    "external" in link ? link.external : undefined
                  )
                }
              >
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
