import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/mon-compte";

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie");
      navigate(redirectTo);
    } catch (err) {
      toast.error("Échec", { description: err.response?.data?.detail || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-2xl border bg-[hsl(var(--card))] p-7 alix-card-shadow">
        <h1 className="font-display text-3xl">Connexion</h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Accédez à votre compte et vos commandes.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="login-email-input" placeholder="email@exemple.com" />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="login-password-input" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full h-11" data-testid="login-submit-button">{submitting ? "Connexion…" : "Se connecter"}</Button>
        </form>
        <div className="mt-4 text-sm text-center text-[hsl(var(--muted-foreground))]">
          Pas de compte ? <Link to="/inscription" className="text-[var(--alix-bronze)] font-medium" data-testid="login-register-link">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
