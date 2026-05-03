import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Le mot de passe doit contenir au moins 6 caractères");
    setSubmitting(true);
    try {
      await register(form);
      toast.success("Bienvenue chez Alixco Luxe !");
      navigate("/mon-compte");
    } catch (err) {
      toast.error("Échec", { description: err.response?.data?.detail || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="rounded-2xl border bg-[hsl(var(--card))] p-7 alix-card-shadow">
        <h1 className="font-display text-3xl">Créer un compte</h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Rejoignez la communauté Alixco Luxe.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Nom complet</Label>
            <Input value={form.fullName} onChange={onField("fullName")} required data-testid="register-name-input" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={onField("email")} required data-testid="register-email-input" />
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={form.phone} onChange={onField("phone")} placeholder="+229 ..." data-testid="register-phone-input" />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input type="password" value={form.password} onChange={onField("password")} required minLength={6} data-testid="register-password-input" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full h-11" data-testid="register-submit-button">{submitting ? "Création…" : "Créer mon compte"}</Button>
        </form>
        <div className="mt-4 text-sm text-center text-[hsl(var(--muted-foreground))]">
          Déjà un compte ? <Link to="/connexion" className="text-[var(--alix-bronze)] font-medium" data-testid="register-login-link">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
