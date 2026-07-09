"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      website, // honeypot value
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus("success");
      form.reset();
      setWebsite("");
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Une erreur s'est produite. Réessayez."
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "contact@sknstudio.dz",
      href: "mailto:contact@sknstudio.dz",
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: "+213 5 55 12 34 56",
      href: "tel:+213555123456",
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: "Alger, Algérie",
      href: "#",
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-blue">Contact</p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">On est là pour vous</h2>
        <p className="mt-3 text-sm text-ink/60 max-w-2xl mx-auto">
          Une question sur nos produits, votre commande ou besoin de conseils ?
          N&apos;hésitez pas à nous contacter.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <div
                key={info.title}
                className="contact-card rounded-lg border border-powder/40 bg-white/50 p-6 transition-all hover:border-blue/20 hover:bg-white/80 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5">
                    <Icon size={18} className="text-navy/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ink/40">{info.title}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm text-ink/80 transition-colors hover:text-navy"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-sm text-ink/80">{info.details}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="contact-card lg:col-span-2 rounded-lg border border-powder/40 bg-white/50 p-6 transition-all hover:border-blue/20 hover:bg-white/80 hover:shadow-sm sm:p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot — hidden from real users, bots fill it anyway */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">
                  Nom complet
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Votre nom"
                  className="w-full rounded-lg border border-powder/40 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-blue/30 focus:outline-none focus:ring-1 focus:ring-blue/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  placeholder="votre@email.dz"
                  className="w-full rounded-lg border border-powder/40 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-blue/30 focus:outline-none focus:ring-1 focus:ring-blue/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">
                Sujet
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                maxLength={200}
                placeholder="Votre sujet"
                className="w-full rounded-lg border border-powder/40 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-blue/30 focus:outline-none focus:ring-1 focus:ring-blue/20"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                maxLength={5000}
                placeholder="Votre message..."
                className="w-full rounded-lg border border-powder/40 bg-white/60 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-blue/30 focus:outline-none focus:ring-1 focus:ring-blue/20 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-all hover:bg-navy/80 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Envoi en cours..."
              ) : submitStatus === "success" ? (
                <span>✓ Message envoyé</span>
              ) : (
                <>
                  <span>Envoyer</span>
                  <Send size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <p className="text-center text-sm text-green-600 animate-in fade-in duration-300">
                Merci ! Nous vous répondrons dans les plus brefs délais.
              </p>
            )}

            {submitStatus === "error" && (
              <p className="text-center text-sm text-red-600 animate-in fade-in duration-300">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}