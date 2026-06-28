"use client";

import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "@/app/components/styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import Link from "next/link";
import { useLoading } from "@/app/components/context/LoadingProvider";

const SocialIcons = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (isLoading) return;
    const social = document.getElementById("social");
    if (!social) return;

    const cleanups: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement | null;
      if (!link) return;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = mouseX;
      let currentY = mouseY;
      let frameId = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        const bounds = elem.getBoundingClientRect();
        link.style.transform = `translate(${currentX - bounds.width / 2}px, ${currentY - bounds.height / 2}px)`;

        frameId = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const bounds = elem.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = bounds.width / 2;
          mouseY = bounds.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      frameId = requestAnimationFrame(updatePosition);

      cleanups.push(() => {
        document.removeEventListener("mousemove", onMouseMove);
        cancelAnimationFrame(frameId);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://x.com" target="_blank">
            <FaXTwitter />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <Link className="resume-button" 
      href="https://drive.google.com/file/d/1oyzL94yw-HH31GBICnaUXWWECfBsDrik/view?usp=drive_link"
      target="_blank">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </Link>
    </div>
  );
};

export default SocialIcons;
