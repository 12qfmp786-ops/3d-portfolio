import { PropsWithChildren } from "react";
import "@/app/components/styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
    <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
          Aftab 
              <br />
              <span>Shaikh</span>
            </h1>
          </div>
          {/* <Block></Block> */}
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Designer</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <div className="landing-h2-info-1">Designer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>

    </>
  );
};

export default Landing;
