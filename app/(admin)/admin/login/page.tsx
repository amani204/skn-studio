"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      // Prevents information leakage with a generic error
      setError("Identifiants invalides. Veuillez réessayer.");
      return;
    }

    // Redirect to localized admin dashboard route
    router.push(`/admin`);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-display text-ink tracking-tight">
            Espace Administration
          </h1>
          <p className="text-sm font-body text-ink/60">
            Connectez-vous pour accéder au gestionnaire de la boutique.
          </p>
        </div>

        {/* Card Form */}
        <div className="border border-powder/80 rounded-lg bg-[#fffdf9] backdrop-blur-md p-8 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-ink/70"
              >
                Adresse E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-powder/80 bg-white text-sm text-ink placeholder-ink/30 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all font-body"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wider text-ink/70"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg border border-powder/80 bg-white text-sm text-ink placeholder-ink/30 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink/40 hover:text-ink transition-colors"
                  title={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-body"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-navy hover:bg-navy/90 text-white px-5 py-3 text-xs font-medium uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se Connecter"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}