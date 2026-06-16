import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "@/app/components/styles/Contact.css";

const Contact = () => {
    return (
        <div className="contact-section section-container" id="contact">
            <div className="contact-container">
         

                <div className="contact-flex">

                    <div className="contact-box">
                    <h3>CONTACT</h3>

                        <h4>Email</h4>
                        <p>
                            <a href="mailto:example@mail.com" data-cursor="disable">
                                aftabdev108@gmail.com
                            </a>
                        </p>
                        <h4>Phone</h4>
                        <p>
                            <a href="tel:+9199999999" data-cursor="disable">
                                +91 8484075652
                            </a>
                        </p>
                    </div>
                    <div className="Social-box">
                        <h4>Social</h4>
                        <a
                            href="https://github.com"
                            target="_blank"
                            data-cursor="disable"
                            className="contact-social"
                        >
                            Github <MdArrowOutward />
                        </a>
                        <a
                            href="https://www.linkedin.com"
                            target="_blank"
                            data-cursor="disable"
                            className="contact-social"
                        >
                            Linkedin <MdArrowOutward />
                        </a>
                        <a
                            href="https://x.com"
                            target="_blank"
                            data-cursor="disable"
                            className="contact-social"
                        >
                            Twitter <MdArrowOutward />
                        </a>
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            data-cursor="disable"
                            className="contact-social"
                        >
                            Instagram <MdArrowOutward />
                        </a>
                    </div>
                    <div className="contact-box">
                        <h2 >
                            Designed and Developed <br /> by <span>Aftab Shaikh</span>
                        </h2>
                        <h5 className="contact-copyright">
                            <MdCopyright /> 2026
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
