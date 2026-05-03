{
  "meta": {
    "project": "Alixco Luxe",
    "language": "fr-FR",
    "currency": "XOF (FCFA)",
    "positionnement": ["luxe artisanal", "chaleureux", "premium mais accessible", "orienté conversion WhatsApp"],
    "notes": [
      "Checkout sans paiement en ligne: panier → redirection WhatsApp pour confirmation/négociation.",
      "Mobile-first (usage smartphone majoritaire).",
      "Différencier visuellement: Public = chaleureux & premium; Admin = neutre & data-focused."
    ]
  },
  "brand_attributes": {
    "adjectifs": ["raffiné", "authentique", "confiant", "chaleureux", "orienté service"],
    "do": [
      "Mettre en avant la matière (bois/métal) via textures très subtiles et photos macro.",
      "Utiliser beaucoup d'espace blanc/ivoire + accents bronze.",
      "CTA WhatsApp clair et répétitif (sans être agressif)."
    ],
    "dont": [
      "Éviter les looks 'template SaaS' sur la boutique.",
      "Éviter les gradients saturés (règles ci-dessous).",
      "Éviter les mises en page centrées globalement (lecture naturelle)."
    ]
  },
  "design_tokens": {
    "css_custom_properties": {
      "instructions": "À implémenter dans /app/frontend/src/index.css (dans @layer base :root). Garder les tokens shadcn (HSL) + ajouter des tokens marque (hex) pour textures/accents. Ne pas utiliser transition: all.",
      "public_theme_hsl_tokens": {
        "--background": "36 33% 97%",
        "--foreground": "24 18% 12%",
        "--card": "36 33% 99%",
        "--card-foreground": "24 18% 12%",
        "--popover": "36 33% 99%",
        "--popover-foreground": "24 18% 12%",
        "--primary": "24 22% 14%",
        "--primary-foreground": "36 33% 97%",
        "--secondary": "34 28% 92%",
        "--secondary-foreground": "24 22% 14%",
        "--muted": "34 22% 93%",
        "--muted-foreground": "24 10% 38%",
        "--accent": "32 45% 88%",
        "--accent-foreground": "24 22% 14%",
        "--destructive": "0 72% 52%",
        "--destructive-foreground": "36 33% 97%",
        "--border": "30 18% 86%",
        "--input": "30 18% 86%",
        "--ring": "28 55% 45%",
        "--radius": "0.75rem",
        "--chart-1": "28 55% 45%",
        "--chart-2": "164 38% 34%",
        "--chart-3": "24 22% 14%",
        "--chart-4": "40 70% 55%",
        "--chart-5": "12 55% 52%"
      },
      "brand_hex_tokens_extra": {
        "--alix-ivory": "#FBF7F0",
        "--alix-paper": "#F4EDE2",
        "--alix-ink": "#1F1A16",
        "--alix-walnut": "#3A2A22",
        "--alix-bronze": "#B07A3A",
        "--alix-brass": "#C9A46A",
        "--alix-forest": "#1F4D3A",
        "--alix-whatsapp": "#25D366",
        "--alix-shadow": "0 18px 45px rgba(31, 26, 22, 0.10)",
        "--alix-shadow-soft": "0 10px 25px rgba(31, 26, 22, 0.08)",
        "--alix-noise-opacity": "0.06"
      },
      "admin_theme_hsl_tokens": {
        "note": "Admin = plus neutre, lisible, data-first. Peut rester en mode clair par défaut (éviter dark-mode par défaut pour ce projet retail).",
        "--background": "0 0% 100%",
        "--foreground": "222 47% 11%",
        "--card": "0 0% 100%",
        "--card-foreground": "222 47% 11%",
        "--primary": "222 47% 11%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "210 40% 96%",
        "--secondary-foreground": "222 47% 11%",
        "--muted": "210 40% 96%",
        "--muted-foreground": "215 16% 47%",
        "--accent": "210 40% 96%",
        "--accent-foreground": "222 47% 11%",
        "--border": "214 32% 91%",
        "--ring": "28 55% 45%",
        "--radius": "0.6rem"
      },
      "spacing_and_radius": {
        "spacing_scale_px": [4, 8, 12, 16, 24, 32, 48, 64],
        "container": "max-w-6xl mx-auto px-4 sm:px-6",
        "radius": {
          "card": "rounded-xl",
          "button": "rounded-lg",
          "input": "rounded-lg"
        }
      },
      "shadows": {
        "card_default": "shadow-[var(--alix-shadow-soft)]",
        "card_hover": "hover:shadow-[var(--alix-shadow)]",
        "focus_ring": "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
      }
    }
  },
  "typography": {
    "font_pairing": {
      "headings": {
        "google_font": "Gloock",
        "fallback": "ui-serif, Georgia, serif",
        "usage": "H1/H2, titres de sections, titres produit (premium editorial)"
      },
      "body": {
        "google_font": "Manrope",
        "fallback": "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        "usage": "texte courant, UI, admin"
      },
      "numbers_optional": {
        "google_font": "Azeret Mono",
        "usage": "prix/stock/KPI (optionnel, parcimonie)"
      }
    },
    "tailwind_text_hierarchy": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl font-[600] tracking-[-0.02em]",
      "h2": "text-base md:text-lg text-muted-foreground",
      "section_title": "font-[600] text-2xl sm:text-3xl tracking-[-0.01em]",
      "product_title": "text-lg sm:text-xl font-[600]",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs sm:text-sm text-muted-foreground"
    },
    "css_snippet": {
      "instructions": "Importer via Google Fonts dans index.html ou via @import dans index.css. Appliquer sur body et headings.",
      "example": "body { font-family: 'Manrope', ui-sans-serif, system-ui; }\nh1,h2,h3,.font-display { font-family: 'Gloock', ui-serif, Georgia; }"
    }
  },
  "color_palette": {
    "public": {
      "backgrounds": {
        "ivory": "#FBF7F0",
        "paper": "#F4EDE2",
        "card": "#FFFCF7"
      },
      "text": {
        "ink": "#1F1A16",
        "muted": "#5B514A"
      },
      "accents": {
        "bronze": "#B07A3A",
        "brass": "#C9A46A",
        "forest": "#1F4D3A",
        "whatsapp": "#25D366"
      },
      "borders": {
        "warm_border": "#E6D8C7"
      },
      "allowed_gradients": {
        "hero_background_only": "linear-gradient(135deg, rgba(201,164,106,0.18) 0%, rgba(244,237,226,0.65) 45%, rgba(31,77,58,0.10) 100%)",
        "note": "Gradient uniquement en fond de section hero (≤20% viewport)."
      },
      "texture": {
        "approach": "Ajouter un overlay noise très subtil sur les sections premium (hero, bandeau).",
        "css_hint": "background-image: radial-gradient(rgba(31,26,22,0.06) 1px, transparent 1px); background-size: 3px 3px; opacity: var(--alix-noise-opacity);"
      }
    },
    "admin": {
      "background": "#FFFFFF",
      "surface": "#F8FAFC",
      "text": "#0F172A",
      "muted": "#475569",
      "accent": "#B07A3A",
      "success": "#16A34A",
      "warning": "#D97706",
      "danger": "#DC2626"
    }
  },
  "layout_and_grid": {
    "global": {
      "container": "max-w-6xl mx-auto px-4 sm:px-6",
      "section_spacing": "py-10 sm:py-14",
      "grid": {
        "catalog": "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4",
        "homepage_categories": "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
        "admin_kpis": "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        "admin_main": "grid gap-6 lg:grid-cols-12"
      }
    },
    "page_patterns": {
      "home": {
        "structure": [
          "Header (nav + recherche + panier)",
          "Hero editorial (titre + promesse + CTA WhatsApp + CTA Catalogue)",
          "Bento: Catégories (bois, métal, bijoux, vêtements, tableaux, accessoires)",
          "Produits en vedette (carousel ou grid)",
          "Services (cards)",
          "Processus (3 étapes: Choisir → Personnaliser → Confirmer sur WhatsApp)",
          "Avis/Confiance (badges + mini témoignages)",
          "À propos (citation propriétaire + atelier)",
          "Footer (contact, WhatsApp, horaires, réseaux)"
        ],
        "hero_layout": "Split asymétrique: texte à gauche, collage photo à droite (2 images empilées + 1 petite carte 'Délai moyen'). Mobile: texte puis collage.",
        "conversion": "WhatsApp CTA visible dans hero + sticky floating button. Ajouter un bandeau 'Devis rapide sur WhatsApp'."
      },
      "catalog": {
        "structure": [
          "Topbar: titre + résultats + tri",
          "Left filters (desktop) / Drawer filters (mobile)",
          "Grid produits",
          "Pagination"
        ],
        "filters": "Catégorie (Select), Prix (Slider), Disponibilité (Switch), Recherche (Input avec icône)."
      },
      "product_detail": {
        "structure": [
          "Breadcrumb",
          "Gallery (carousel + thumbnails)",
          "Titre + prix + badges (fait main, personnalisable)",
          "Description + matières",
          "Textarea notes de personnalisation",
          "Quantité (Stepper)",
          "CTA: Ajouter au panier + Commander via WhatsApp",
          "Section 'Vous aimerez aussi'"
        ],
        "mobile": "CTA sticky bottom bar: prix + bouton WhatsApp (principal) + panier (secondaire)."
      },
      "cart": {
        "structure": [
          "Liste items (image + titre + notes + qty)",
          "Résumé (total, frais éventuels, note)",
          "CTA 'Valider via WhatsApp'"
        ],
        "whatsapp_message": "Pré-remplir message: items + quantités + notes + total FCFA + nom/téléphone si connecté."
      },
      "auth_account": {
        "style": "Cartes sur fond ivoire, illustration/texture subtile. Form fields larges, labels clairs.",
        "order_history": "Table responsive (cards sur mobile)."
      },
      "admin_dashboard": {
        "structure": [
          "Sidebar (desktop) / Sheet (mobile)",
          "Header: recherche (Command), avatar, notifications",
          "KPIs cards",
          "Charts (Recharts) + alertes stock",
          "Table commandes récentes"
        ],
        "tone": "Neutre, efficace, peu de texture. Accent bronze uniquement pour highlights."
      }
    }
  },
  "components": {
    "component_path": {
      "shadcn_primary": "/app/frontend/src/components/ui/",
      "use": {
        "navigation": ["navigation-menu.jsx", "breadcrumb.jsx", "sheet.jsx", "dropdown-menu.jsx"],
        "forms": ["form.jsx", "input.jsx", "textarea.jsx", "select.jsx", "checkbox.jsx", "radio-group.jsx", "switch.jsx", "slider.jsx", "label.jsx"],
        "content": ["card.jsx", "badge.jsx", "separator.jsx", "tabs.jsx", "accordion.jsx", "table.jsx", "pagination.jsx", "carousel.jsx", "aspect-ratio.jsx", "skeleton.jsx"],
        "overlays": ["dialog.jsx", "alert-dialog.jsx", "popover.jsx", "tooltip.jsx", "sonner.jsx"],
        "utilities": ["scroll-area.jsx", "resizable.jsx"]
      }
    },
    "public_storefront": {
      "header": {
        "pattern": "Header sticky léger (backdrop-blur) avec logo typographique + recherche + icônes compte/panier.",
        "classes": "sticky top-0 z-40 border-b bg-[hsl(var(--background))]/85 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/70",
        "testids": {
          "search_input": "catalog-search-input",
          "cart_link": "header-cart-link",
          "account_link": "header-account-link",
          "whatsapp_support": "header-whatsapp-support-link"
        }
      },
      "product_card": {
        "base": "group rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-[var(--alix-shadow-soft)]",
        "image": "aspect-[4/5] overflow-hidden rounded-lg bg-[hsl(var(--muted))]",
        "title": "mt-3 line-clamp-2 font-[600]",
        "price": "mt-1 font-[700] text-[hsl(var(--foreground))]",
        "badge": "bg-[rgba(201,164,106,0.18)] text-[hsl(var(--foreground))]",
        "hover": "image zoom: group-hover:scale-[1.03] transition-transform duration-300",
        "cta": "Bouton 'Ajouter' en secondaire + icône. WhatsApp CTA réservé au PDP et panier.",
        "testids": {
          "card": "product-card",
          "add_to_cart": "product-card-add-to-cart-button"
        }
      },
      "buttons": {
        "style": "Luxe / Elegant: radius 10-12px, surfaces solides, accent bronze en outline/hover.",
        "variants": {
          "primary": "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/92",
          "secondary": "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary))]/80",
          "outline": "border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--accent))]",
          "whatsapp": "bg-[var(--alix-whatsapp)] text-white hover:bg-[#1FB85A]"
        },
        "motion": "hover: translateY(-1px) via shadow only; active: scale-95. Transitions: transition-colors, transition-shadow (pas transition-all).",
        "testids": {
          "whatsapp_primary": "whatsapp-primary-cta-button",
          "catalog_primary": "catalog-primary-cta-button"
        }
      },
      "filters": {
        "mobile": "Utiliser <Sheet> pour filtres. Bouton 'Filtres' sticky sous la topbar.",
        "desktop": "Colonne gauche (w-72) avec ScrollArea.",
        "testids": {
          "open_filters": "catalog-open-filters-button",
          "price_slider": "catalog-price-slider",
          "category_select": "catalog-category-select"
        }
      },
      "whatsapp_floating": {
        "pattern": "Bouton flottant rond en bas à droite, avec tooltip 'Besoin d'aide ?'.",
        "classes": "fixed bottom-4 right-4 z-50 rounded-full shadow-lg",
        "size": "h-12 w-12",
        "behavior": "Sur scroll down: réduire en icône; sur scroll up: afficher label (optionnel).",
        "testids": {
          "floating": "whatsapp-floating-button"
        }
      },
      "toasts": {
        "library": "sonner",
        "use_cases": [
          "Ajout au panier",
          "Copie du message WhatsApp",
          "Redirection WhatsApp (info)"
        ],
        "testids": {
          "toast_region": "toast-region"
        }
      }
    },
    "admin": {
      "shell": {
        "sidebar": "NavigationMenu + icons lucide-react. Desktop fixed, mobile Sheet.",
        "header": "Command (search), DropdownMenu (user), Badge (status).",
        "testids": {
          "admin-sidebar": "admin-sidebar",
          "admin-mobile-menu": "admin-mobile-menu-button"
        }
      },
      "tables": {
        "use": "table.jsx + pagination.jsx + dropdown-menu.jsx pour actions (modifier/supprimer).",
        "row_actions": "DropdownMenuItem: 'Modifier', 'Dupliquer', 'Supprimer' (AlertDialog).",
        "testids": {
          "orders-table": "admin-orders-table",
          "products-table": "admin-products-table"
        }
      },
      "charts": {
        "library": "recharts",
        "patterns": [
          "LineChart CA (7/30 jours)",
          "BarChart commandes par catégorie",
          "AreaChart tendance"
        ],
        "styling": "Traits fins, gridlines très légères (strokeOpacity 0.15). Couleurs: bronze + forest + slate.",
        "testids": {
          "sales-chart": "admin-sales-chart"
        }
      }
    }
  },
  "motion_and_microinteractions": {
    "library": {
      "recommended": "framer-motion",
      "install": "npm i framer-motion",
      "usage": "Entrées de sections (fade+slide), hover lift sur cards, drawer transitions. Respecter prefers-reduced-motion."
    },
    "principles": [
      "Durations: 160–220ms pour hover; 240–320ms pour entrées.",
      "Easing: cubic-bezier(0.2, 0.8, 0.2, 1).",
      "Ne pas animer layout de texte (lisibilité).",
      "Pas de transition: all. Utiliser transition-colors, transition-shadow, transition-transform uniquement sur éléments ciblés."
    ],
    "examples": {
      "product_card_hover": "image scale 1.03 + shadow soft + badge fade-in",
      "add_to_cart": "toast + mini animation du compteur panier (scale 1.05 puis retour)",
      "whatsapp_redirect": "Dialog de confirmation optionnel (sur desktop) + toast 'Ouverture de WhatsApp…'"
    }
  },
  "imagery_and_icons": {
    "direction": {
      "photography": [
        "Macro matière (grain du bois, reflets métal)",
        "Mains en action (gravure, polissage)",
        "Packshots sur fond ivoire/papier",
        "Lifestyle cadeau (sobre, pas trop 'stock')"
      ],
      "textures": "Utiliser une texture noise CSS (pas d'images lourdes) + éventuellement 1 texture bois très légère en hero (opacity 6-10%).",
      "icons": "lucide-react uniquement (pas d'emojis). Style stroke 1.75–2px."
    },
    "image_urls": {
      "note": "Le tool d'images a échoué (providers indisponibles). Utiliser des placeholders temporaires + remplacer plus tard par assets réels. Prévoir lazy-loading.",
      "placeholders": [
        {
          "category": "hero",
          "description": "Image atelier / mains en train de graver (à remplacer)",
          "url": "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80"
        },
        {
          "category": "product",
          "description": "Placeholder produit premium sur fond neutre",
          "url": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80"
        },
        {
          "category": "about",
          "description": "Texture bois / atelier (à remplacer)",
          "url": "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80"
        }
      ]
    }
  },
  "accessibility": {
    "requirements": [
      "Contraste AA minimum (texte sur ivoire: utiliser ink #1F1A16).",
      "Focus visible: ring via --ring (bronze) + ring-offset.",
      "Zones tactiles: min 44px (boutons, icônes header).",
      "prefers-reduced-motion: désactiver animations d'entrée et réduire hover transforms.",
      "Alt text FR descriptif pour images produits."
    ]
  },
  "data_testid_policy": {
    "rule": "Tous les éléments interactifs et infos clés DOIVENT avoir data-testid (kebab-case, rôle fonctionnel).",
    "examples": [
      "data-testid=\"product-detail-add-to-cart-button\"",
      "data-testid=\"cart-whatsapp-checkout-button\"",
      "data-testid=\"admin-product-form-save-button\"",
      "data-testid=\"admin-kpi-revenue-value\""
    ]
  },
  "instructions_to_main_agent": {
    "high_priority": [
      "Remplacer le CSS CRA par défaut: supprimer styles .App-header centrés et fond noir dans App.css (ne pas centrer globalement).",
      "Mettre à jour les tokens :root dans index.css selon public_theme_hsl_tokens; prévoir un wrapper .admin (ou route-level class) pour admin_theme_hsl_tokens si besoin.",
      "Implémenter une barre WhatsApp flottante sur toutes les pages publiques + CTA WhatsApp sur PDP et panier.",
      "Format prix: '15 000 FCFA' (séparateur espace).",
      "Utiliser shadcn/ui pour tous les composants (Select, Dialog, Sheet, Calendar si nécessaire).",
      "Ajouter data-testid partout où requis (boutons, inputs, valeurs KPI, messages d'erreur)."
    ],
    "libraries": [
      {
        "name": "framer-motion",
        "why": "micro-interactions + entrées de sections",
        "install": "npm i framer-motion"
      },
      {
        "name": "recharts",
        "why": "charts admin (CA, commandes, catégories)",
        "install": "npm i recharts"
      },
      {
        "name": "lucide-react",
        "why": "icônes cohérentes",
        "install": "(déjà souvent présent; sinon) npm i lucide-react"
      }
    ],
    "whatsapp": {
      "cta_copy_fr": {
        "primary": "Commander sur WhatsApp",
        "support": "Besoin d'aide ?",
        "cart": "Valider via WhatsApp"
      },
      "message_template": "Bonjour Alixco Luxe, je souhaite commander :%0A- {items}%0A%0ANotes de personnalisation : {notes}%0A%0ATotal estimé : {total} FCFA%0A%0ANom : {name}%0ATéléphone : {phone}",
      "phone_number": "À configurer (format international +229...)"
    }
  },
  "general_ui_ux_design_guidelines_appendix": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
