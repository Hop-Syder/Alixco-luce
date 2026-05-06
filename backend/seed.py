# /**
#  * @author @hopsyder
#  * @organization Nexus Partners
#  * @description Script d'initialisation de la base de données MongoDB Atlas
#  * @created 2026-05-06
#  * @updated 2026-05-06
#  * 🌐 ceo.nexuspartners.xyz
#  * 📧 daoudaabassichristian@gmail.com
# */
import asyncio
import os
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import bcrypt

load_dotenv()

async def seed():
    print("🚀 Début du seeding Alixco Luxe...")
    
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'alixco_luce')
    
    if not mongo_url:
        print("❌ Erreur: MONGO_URL non trouvée dans le .env")
        return

    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=60000, connectTimeoutMS=60000)
    db = client[db_name]

    # 1. Nettoyage
    collections = ['categories', 'products', 'services', 'admins', 'users', 'orders']
    for coll in collections:
        await db[coll].delete_many({})
    print("✨ Collections nettoyées.")

    # 2. Admin par défaut
    admin_id = str(uuid.uuid4())
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@alixcoluxe.com')
    admin_pass = os.environ.get('ADMIN_PASSWORD', 'AdminPass123!')
    hashed_pass = bcrypt.hashpw(admin_pass.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    await db.admins.insert_one({
        "id": admin_id,
        "email": admin_email,
        "password": hashed_pass,
        "fullName": "Administrateur Alixco",
        "createdAt": "2026-05-06T00:00:00Z"
    })
    print(f"👤 Admin créé: {admin_email}")

    # 3. Catégories
    cats_data = [
        {"name": "Bijoux", "slug": "bijoux", "icon": "💍", "desc": "Éclat et finesse pour chaque occasion."},
        {"name": "Maroquinerie", "slug": "maroquinerie", "icon": "👜", "desc": "Cuirs nobles et finitions artisanales."},
        {"name": "Décoration", "slug": "decoration", "icon": "🏺", "desc": "Sublimez votre intérieur avec l'unique."},
        {"name": "Accessoires", "slug": "accessoires", "icon": "🕶️", "desc": "Le détail qui fait toute la différence."},
        {"name": "Textile", "slug": "textile", "icon": "🧵", "desc": "Tissus d'exception et broderies fines."},
        {"name": "Cadeaux", "slug": "cadeaux", "icon": "🎁", "desc": "L'art d'offrir l'inoubliable."}
    ]
    
    categories = {}
    for cat in cats_data:
        c_id = str(uuid.uuid4())
        cat["id"] = c_id
        await db.categories.insert_one(cat)
        categories[cat["slug"]] = c_id
    print(f"📂 {len(cats_data)} Catégories créées.")

    # 4. Produits
    products = [
        {
            "name": "Bracelet 'Horizon' Gravé",
            "description": "Bracelet en argent massif avec gravure personnalisée sur mesure.",
            "price": 45000,
            "categoryId": categories["bijoux"],
            "images": ["https://images.unsplash.com/photo-1573408302185-9111fb30c90d?auto=format&fit=crop&w=800&q=80"],
            "stock": 10,
            "featured": True,
            "material": "Argent 925",
            "dimensions": "Ajustable"
        },
        {
            "name": "Sac Cabas 'Alix' Cuir",
            "description": "Sac en cuir de veau pleine fleur, tannage végétal, fait main.",
            "price": 125000,
            "categoryId": categories["maroquinerie"],
            "images": ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"],
            "stock": 5,
            "featured": True,
            "material": "Cuir de Veau",
            "dimensions": "40x30x15 cm"
        },
        {
            "name": "Vide-poche en Bois d'Ebène",
            "description": "Pièce unique sculptée dans de l'ébène précieux avec incrustations.",
            "price": 35000,
            "categoryId": categories["decoration"],
            "images": ["https://images.unsplash.com/photo-1590483734724-38fa19744990?auto=format&fit=crop&w=800&q=80"],
            "stock": 3,
            "featured": True,
            "material": "Bois d'Ebène",
            "dimensions": "20 cm diamètre"
        },
        {
            "name": "Portefeuille 'Minimaliste'",
            "description": "Portefeuille compact en cuir exotique, gravure initiale incluse.",
            "price": 25000,
            "categoryId": categories["maroquinerie"],
            "images": ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"],
            "stock": 15,
            "featured": False,
            "material": "Cuir de Crocodile",
            "dimensions": "10x8 cm"
        },
        {
            "name": "Bougies Parfumées 'Luxe'",
            "description": "Cire de soja naturelle dans un écrin en laiton gravé.",
            "price": 18000,
            "categoryId": categories["decoration"],
            "images": ["https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"],
            "stock": 20,
            "featured": False,
            "material": "Cire & Laiton",
            "dimensions": "250g"
        }
    ]

    for p in products:
        p["id"] = str(uuid.uuid4())
        p["active"] = True
        p["customizable"] = True
        p["createdAt"] = "2026-05-06T00:00:00Z"
        await db.products.insert_one(p)
    print(f"💎 {len(products)} Produits créés.")

    # 5. Services
    services = [
        {
            "name": "Gravure Laser Haute Précision",
            "description": "Personnalisation sur métal, bois, verre et cuir avec une précision millimétrique.",
            "priceFrom": 5000,
            "icon": "✨",
            "featured": True,
            "images": ["https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80"]
        },
        {
            "name": "Broderie Personnalisée",
            "description": "Donnez vie à vos textiles avec nos broderies artisanales ou numériques.",
            "priceFrom": 3500,
            "icon": "🧵",
            "featured": True,
            "images": ["https://images.unsplash.com/photo-1528459801416-a7e9927967a8?auto=format&fit=crop&w=800&q=80"]
        },
        {
            "name": "Couture Sur-Mesure",
            "description": "Réalisation de pièces vestimentaires uniques adaptées à votre morphologie.",
            "priceFrom": 15000,
            "icon": "👗",
            "featured": True,
            "images": ["https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?auto=format&fit=crop&w=800&q=80"]
        }
    ]

    for s in services:
        s["id"] = str(uuid.uuid4())
        s["active"] = True
        await db.services.insert_one(s)
    print(f"🛠️ {len(services)} Services créés.")

    print("\n✅ Seeding terminé avec succès sur MongoDB Atlas !")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
