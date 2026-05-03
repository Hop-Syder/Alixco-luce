import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Bienvenue");
      navigate("/admin");
    } catch (err) {
      toast.error("Échec", { description: err.response?.data?.detail || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-theme min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4">
      <div className="w-full max-w-md rounded-2xl border bg-[hsl(var(--card))] p-8 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-[var(--alix-bronze)]" />
          <span className="text-xs uppercase tracking-wider text-[var(--alix-bronze)] font-semibold">Administration</span>
        </div>
        <h1 className="font-display text-3xl">Alixco Luxe Admin</h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Connectez-vous pour gérer votre boutique.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="admin-login-email-input" placeholder="admin@alixcoluxe.com" />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="admin-login-password-input" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full h-11" data-testid="admin-login-submit-button">
            {submitting ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
