"use client";

import { useEffect } from "react";
import "../styles/Career.css";
import { initCareerLineFX } from "@/app/components/util/careerFX";

const Career = () => {
  useEffect(() => {
    let cleanup = () => {};
    const timer = window.setTimeout(() => {
      cleanup = initCareerLineFX();
    }, 400);

    return () => {
      window.clearTimeout(timer);
      cleanup();
    };
  }, []);

  return (
    <div className="career-section section-container" id="experience">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineer</h4>
                <h5>Mavonic Technology Pvt. Ltd.</h5>
              </div>
              <h3>Now</h3>
            </div>
       
            <p>
              Built and optimized responsive web interfaces for a design agency project, ensuring cross-device
              compatibility and improved performance. Contributed to the NK Construction App, enabling employee onboarding,
              employee record management, and automated salary calculation.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Junior Technical Consultant</h4>
                <h5>Squad Logic.</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Played a key role in testing and troubleshooting APIs to ensure optimal functionality and
              reliability, using advanced tools like Postman and SQL for querying and debugging.
            </p>
        
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;
