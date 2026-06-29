"use client";

import { FormEvent, useState } from "react";
import { MdChevronRight } from "react-icons/md";
import "@/app/components/styles/Contact.css";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "aftabshaikh5498@gmail.com";

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

type FormStatus = "idle" | "loading" | "success" | "error";

type Web3FormsResponse = {
  success: boolean;
  message?: string;
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      if (!WEB3FORMS_ACCESS_KEY) {
        throw new Error("Email service is not configured.");
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          message,
          subject: `Portfolio contact from ${name}`,
        }),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("Email service returned an unexpected response.");
      }

      const data = (await response.json()) as Web3FormsResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Something went wrong.");
      }

      setStatus("success");
      setFeedback("Message sent successfully. I'll get back to you soon!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container pointer-events-auto">
        <h3 className="contact-heading">LET&apos;S WORK TOGETHER</h3>

        <div className="contact-layout">
          <form
            className="contact-form-card pointer-events-auto"
            onSubmit={handleSubmit}
          >
            <div className="contact-form-header">
              <h4>Contact Form</h4>
              <p>
                Please contact me directly at{" "}
                <strong>{CONTACT_EMAIL}</strong> or drop your info here.
              </p>
            </div>

            <div className="contact-form-row">
              <div className="contact-field">
                <label htmlFor="contact-name">Full name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={status === "loading"}
                />
              </div>
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell me about about your project,"
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                disabled={status === "loading"}
              />
            </div>

            <p className="contact-privacy">
              I&apos;ll never share your data with anyone else. Pinky promise!
            </p>

            {feedback ? (
              <p
                className={`contact-feedback contact-feedback--${status === "success" ? "success" : "error"}`}
                role="status"
              >
                {feedback}
              </p>
            ) : null}

            <button
              type="submit"
              className="contact-submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
              <MdChevronRight aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
