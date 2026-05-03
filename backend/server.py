from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Query
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import shutil
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from urllib.parse import quote

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Constants
JWT_SECRET = os.environ.get('JWT_SECRET', 'alixco-luxe-secret-change-in-production-2026')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRE_DAYS = 30
WHATSAPP_NUMBER = os.environ.get('WHATSAPP_NUMBER', '2290197412933')

# Uploads
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

# App
app = FastAPI(title="Alixco Luxe API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Mount static uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


# ============== UTILS ==============
def now_iso():
    return datetime.now(timezone.utc).isoformat()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_token(user_id: str, role: str) -> str:
    payload = {
        'sub': user_id,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS),
        'iat': datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Token invalide")


async def get_current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not creds:
        raise HTTPException(401, "Non authentifié")
    payload = decode_token(creds.credentials)
    user = await db.users.find_one({"id": payload['sub']}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(401, "Utilisateur introuvable")
    user['role'] = payload.get('role', 'customer')
    return user


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not creds:
        raise HTTPException(401, "Non authentifié")
    payload = decode_token(creds.credentials)
    if payload.get('role') != 'admin':
        raise HTTPException(403, "Accès admin requis")
    admin = await db.admins.find_one({"id": payload['sub']}, {"_id": 0, "password": 0})
    if not admin:
        raise HTTPException(401, "Admin introuvable")
    admin['role'] = 'admin'
    return admin


def serialize(doc):
    if doc is None:
        return None
    doc.pop('_id', None)
    doc.pop('password', None)
    return doc


def format_fcfa(amount: float) -> str:
    # e.g. 15000 -> "15 000 FCFA"
    try:
        return f"{int(round(amount)):,}".replace(",", " ") + " FCFA"
    except Exception:
        return f"{amount} FCFA"


def build_whatsapp_url(order: dict) -> str:
    items_text = ""
    for it in order.get('items', []):
        line = f"• {it['name']} x{it['quantity']} — {format_fcfa(it['price'] * it['quantity'])}"
        if it.get('notes'):
            line += f"\n   Personnalisation: {it['notes']}"
        items_text += line + "\n"
    msg = (
        f"Bonjour Alixco Luxe,\n"
        f"Je souhaite passer la commande #{order['orderNumber']}.\n\n"
        f"Articles:\n{items_text}\n"
        f"Total estimé: {format_fcfa(order['total'])}\n\n"
        f"Nom: {order['customerName']}\n"
        f"Téléphone: {order['customerPhone']}\n"
    )
    if order.get('customerAddress'):
        msg += f"Adresse: {order['customerAddress']}\n"
    if order.get('deliveryNotes'):
        msg += f"Notes: {order['deliveryNotes']}\n"
    msg += "\nMerci !"
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={quote(msg)}"


# ============== MODELS ==============
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    fullName: str = Field(min_length=2)
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UpdateProfileRequest(BaseModel):
    fullName: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: float = Field(ge=0)
    categoryId: Optional[str] = None
    images: List[str] = []
    stock: int = Field(ge=0, default=0)
    featured: bool = False
    customizable: bool = True
    active: bool = True
    material: Optional[str] = None
    dimensions: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    categoryId: Optional[str] = None
    images: Optional[List[str]] = None
    stock: Optional[int] = None
    featured: Optional[bool] = None
    customizable: Optional[bool] = None
    active: Optional[bool] = None
    material: Optional[str] = None
    dimensions: Optional[str] = None


class ServiceCreate(BaseModel):
    name: str
    description: str = ""
    priceFrom: float = Field(ge=0, default=0)
    priceTo: Optional[float] = None
    images: List[str] = []
    icon: Optional[str] = None
    featured: bool = False
    active: bool = True


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    priceFrom: Optional[float] = None
    priceTo: Optional[float] = None
    images: Optional[List[str]] = None
    icon: Optional[str] = None
    featured: Optional[bool] = None
    active: Optional[bool] = None


class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int = Field(ge=1)
    notes: Optional[str] = None
    image: Optional[str] = None


class OrderCreate(BaseModel):
    items: List[OrderItem]
    customerName: str
    customerPhone: str
    customerEmail: Optional[EmailStr] = None
    customerAddress: Optional[str] = None
    deliveryNotes: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: str


class BulkPriceUpdate(BaseModel):
    productIds: Optional[List[str]] = None
    categoryId: Optional[str] = None
    percentageChange: float  # e.g. 10 for +10%, -5 for -5%


# ============== AUTH - CUSTOMER ==============
@api_router.post("/auth/register")
async def register(data: RegisterRequest):
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(400, "Cet email est déjà utilisé")
    user = {
        "id": str(uuid.uuid4()),
        "email": data.email.lower(),
        "password": hash_password(data.password),
        "fullName": data.fullName,
        "phone": data.phone or "",
        "address": "",
        "createdAt": now_iso(),
    }
    await db.users.insert_one(user)
    token = create_token(user['id'], 'customer')
    u = serialize(dict(user))
    return {"token": token, "user": u}


@api_router.post("/auth/login")
async def login(data: LoginRequest):
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user['password']):
        raise HTTPException(401, "Email ou mot de passe incorrect")
    token = create_token(user['id'], 'customer')
    return {"token": token, "user": serialize(user)}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user


@api_router.put("/auth/profile")
async def update_profile(data: UpdateProfileRequest, user=Depends(get_current_user)):
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"id": user['id']}, {"$set": updates})
    u = await db.users.find_one({"id": user['id']}, {"_id": 0, "password": 0})
    return u


# ============== AUTH - ADMIN ==============
@api_router.post("/admin/login")
async def admin_login(data: LoginRequest):
    admin = await db.admins.find_one({"email": data.email.lower()})
    if not admin or not verify_password(data.password, admin['password']):
        raise HTTPException(401, "Email ou mot de passe incorrect")
    token = create_token(admin['id'], 'admin')
    return {"token": token, "admin": serialize(admin)}


@api_router.get("/admin/me")
async def admin_me(admin=Depends(get_current_admin)):
    return admin


# ============== CATEGORIES ==============
@api_router.get("/categories")
async def list_categories():
    cats = await db.categories.find({}, {"_id": 0}).sort("name", 1).to_list(500)
    return cats


@api_router.post("/admin/categories")
async def create_category(data: CategoryCreate, admin=Depends(get_current_admin)):
    cat = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "slug": data.slug or data.name.lower().replace(' ', '-'),
        "description": data.description or "",
        "icon": data.icon or "",
        "createdAt": now_iso(),
    }
    await db.categories.insert_one(cat)
    return serialize(cat)


@api_router.put("/admin/categories/{category_id}")
async def update_category(category_id: str, data: CategoryCreate, admin=Depends(get_current_admin)):
    updates = data.model_dump(exclude_none=True)
    await db.categories.update_one({"id": category_id}, {"$set": updates})
    cat = await db.categories.find_one({"id": category_id}, {"_id": 0})
    return cat


@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str, admin=Depends(get_current_admin)):
    await db.categories.delete_one({"id": category_id})
    return {"ok": True}


# ============== PRODUCTS ==============
@api_router.get("/products")
async def list_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    featured: Optional[bool] = None,
    sort: Optional[str] = "newest",
    limit: int = Query(default=100, ge=1, le=500),
):
    query = {"active": True}
    if category:
        query["categoryId"] = category
    if featured is not None:
        query["featured"] = featured
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    if minPrice is not None or maxPrice is not None:
        pr = {}
        if minPrice is not None:
            pr["$gte"] = minPrice
        if maxPrice is not None:
            pr["$lte"] = maxPrice
        query["price"] = pr
    sort_spec = [("createdAt", -1)]
    if sort == "price_asc":
        sort_spec = [("price", 1)]
    elif sort == "price_desc":
        sort_spec = [("price", -1)]
    elif sort == "name":
        sort_spec = [("name", 1)]
    products = await db.products.find(query, {"_id": 0}).sort(sort_spec).to_list(limit)
    return products


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    p = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Produit introuvable")
    return p


@api_router.get("/admin/products")
async def admin_list_products(admin=Depends(get_current_admin)):
    products = await db.products.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return products


@api_router.post("/admin/products")
async def create_product(data: ProductCreate, admin=Depends(get_current_admin)):
    prod = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    await db.products.insert_one(prod)
    return serialize(prod)


@api_router.put("/admin/products/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, admin=Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    updates['updatedAt'] = now_iso()
    await db.products.update_one({"id": product_id}, {"$set": updates})
    p = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Produit introuvable")
    return p


@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, admin=Depends(get_current_admin)):
    res = await db.products.delete_one({"id": product_id})
    return {"ok": res.deleted_count > 0}


@api_router.post("/admin/products/bulk-price")
async def bulk_price_update(data: BulkPriceUpdate, admin=Depends(get_current_admin)):
    query = {}
    if data.productIds:
        query["id"] = {"$in": data.productIds}
    elif data.categoryId:
        query["categoryId"] = data.categoryId
    products = await db.products.find(query).to_list(2000)
    factor = 1 + (data.percentageChange / 100)
    updated = 0
    for p in products:
        new_price = max(0, round(p['price'] * factor))
        await db.products.update_one(
            {"id": p['id']},
            {"$set": {"price": new_price, "updatedAt": now_iso()}},
        )
        updated += 1
    return {"updated": updated}


# ============== UPLOAD ==============
@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    ext = (file.filename or "img").split('.')[-1].lower()
    if ext not in {"png", "jpg", "jpeg", "webp", "gif"}:
        raise HTTPException(400, "Format d'image non supporté")
    fname = f"{uuid.uuid4()}.{ext}"
    dest = UPLOAD_DIR / fname
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    url = f"/uploads/{fname}"
    return {"url": url}


# ============== SERVICES ==============
@api_router.get("/services")
async def list_services():
    services = await db.services.find({"active": True}, {"_id": 0}).sort("createdAt", -1).to_list(500)
    return services


@api_router.get("/admin/services")
async def admin_list_services(admin=Depends(get_current_admin)):
    services = await db.services.find({}, {"_id": 0}).sort("createdAt", -1).to_list(500)
    return services


@api_router.post("/admin/services")
async def create_service(data: ServiceCreate, admin=Depends(get_current_admin)):
    svc = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    await db.services.insert_one(svc)
    return serialize(svc)


@api_router.put("/admin/services/{service_id}")
async def update_service(service_id: str, data: ServiceUpdate, admin=Depends(get_current_admin)):
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    updates['updatedAt'] = now_iso()
    await db.services.update_one({"id": service_id}, {"$set": updates})
    s = await db.services.find_one({"id": service_id}, {"_id": 0})
    if not s:
        raise HTTPException(404, "Service introuvable")
    return s


@api_router.delete("/admin/services/{service_id}")
async def delete_service(service_id: str, admin=Depends(get_current_admin)):
    res = await db.services.delete_one({"id": service_id})
    return {"ok": res.deleted_count > 0}


# ============== ORDERS ==============
async def _next_order_number():
    cnt = await db.orders.count_documents({})
    return f"ALX-{datetime.now().year}-{cnt + 1:05d}"


@api_router.post("/orders")
async def create_order(data: OrderCreate, creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    # Optional auth - order works for guests too
    user_id = None
    user_email = data.customerEmail
    if creds:
        try:
            payload = decode_token(creds.credentials)
            user_id = payload['sub']
            u = await db.users.find_one({"id": user_id})
            if u:
                user_email = user_email or u.get('email')
        except Exception:
            pass

    # Compute total and validate items
    items = []
    total = 0.0
    for item in data.items:
        # Re-fetch price server-side for security
        p = await db.products.find_one({"id": item.productId}, {"_id": 0})
        if not p:
            raise HTTPException(400, f"Produit introuvable: {item.productId}")
        price = p['price']
        items.append({
            "productId": item.productId,
            "name": p['name'],
            "price": price,
            "quantity": item.quantity,
            "notes": item.notes or "",
            "image": (p.get('images') or [None])[0],
        })
        total += price * item.quantity
        # Decrement stock (but don't go below 0)
        if p.get('stock', 0) > 0:
            await db.products.update_one(
                {"id": item.productId},
                {"$inc": {"stock": -min(item.quantity, p['stock'])}},
            )

    order_number = await _next_order_number()
    order = {
        "id": str(uuid.uuid4()),
        "orderNumber": order_number,
        "userId": user_id,
        "items": items,
        "total": total,
        "status": "pending",  # pending, confirmed, in_production, shipped, delivered, cancelled
        "customerName": data.customerName,
        "customerPhone": data.customerPhone,
        "customerEmail": user_email or "",
        "customerAddress": data.customerAddress or "",
        "deliveryNotes": data.deliveryNotes or "",
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    await db.orders.insert_one(order)
    whatsapp_url = build_whatsapp_url(order)
    serialized = serialize(dict(order))
    return {"order": serialized, "whatsappUrl": whatsapp_url}


@api_router.get("/orders/mine")
async def my_orders(user=Depends(get_current_user)):
    orders = await db.orders.find({"userId": user['id']}, {"_id": 0}).sort("createdAt", -1).to_list(500)
    return orders


@api_router.get("/admin/orders")
async def admin_list_orders(status: Optional[str] = None, admin=Depends(get_current_admin)):
    query = {}
    if status:
        query['status'] = status
    orders = await db.orders.find(query, {"_id": 0}).sort("createdAt", -1).to_list(2000)
    return orders


@api_router.get("/admin/orders/{order_id}")
async def admin_get_order(order_id: str, admin=Depends(get_current_admin)):
    o = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not o:
        raise HTTPException(404, "Commande introuvable")
    o['whatsappUrl'] = build_whatsapp_url(o)
    return o


@api_router.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, data: OrderStatusUpdate, admin=Depends(get_current_admin)):
    valid = {"pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"}
    if data.status not in valid:
        raise HTTPException(400, "Statut invalide")
    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": data.status, "updatedAt": now_iso()}},
    )
    o = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return o


# ============== CUSTOMERS (ADMIN) ==============
@api_router.get("/admin/customers")
async def admin_list_customers(admin=Depends(get_current_admin)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).sort("createdAt", -1).to_list(2000)
    # Attach order count + total spent
    for u in users:
        orders = await db.orders.find({"userId": u['id']}, {"_id": 0}).to_list(1000)
        u['ordersCount'] = len(orders)
        u['totalSpent'] = sum(o.get('total', 0) for o in orders if o.get('status') != 'cancelled')
    return users


@api_router.get("/admin/customers/{customer_id}")
async def admin_get_customer(customer_id: str, admin=Depends(get_current_admin)):
    u = await db.users.find_one({"id": customer_id}, {"_id": 0, "password": 0})
    if not u:
        raise HTTPException(404, "Client introuvable")
    orders = await db.orders.find({"userId": customer_id}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    u['orders'] = orders
    return u


# ============== DASHBOARD ==============
@api_router.get("/admin/dashboard")
async def admin_dashboard(admin=Depends(get_current_admin)):
    all_orders = await db.orders.find({}, {"_id": 0}).to_list(10000)
    products = await db.products.find({}, {"_id": 0}).to_list(5000)
    customers_count = await db.users.count_documents({})

    non_cancelled = [o for o in all_orders if o.get('status') != 'cancelled']
    total_revenue = sum(o.get('total', 0) for o in non_cancelled)
    total_orders = len(all_orders)
    pending_orders = len([o for o in all_orders if o.get('status') == 'pending'])
    delivered_orders = len([o for o in all_orders if o.get('status') == 'delivered'])

    low_stock = [p for p in products if p.get('active', True) and 0 < p.get('stock', 0) <= 5]
    out_of_stock = [p for p in products if p.get('active', True) and p.get('stock', 0) == 0]

    # Sales last 30 days
    now = datetime.now(timezone.utc)
    days = []
    for i in range(29, -1, -1):
        d = (now - timedelta(days=i)).date()
        days.append({"date": d.isoformat(), "revenue": 0, "orders": 0})
    day_index = {day['date']: idx for idx, day in enumerate(days)}
    for o in non_cancelled:
        try:
            dt = datetime.fromisoformat(o['createdAt'].replace('Z', '+00:00'))
            d_key = dt.date().isoformat()
            if d_key in day_index:
                days[day_index[d_key]]['revenue'] += o.get('total', 0)
                days[day_index[d_key]]['orders'] += 1
        except Exception:
            pass

    # Top products (by count of occurrences across orders)
    prod_stats = {}
    for o in non_cancelled:
        for it in o.get('items', []):
            pid = it.get('productId')
            if not pid:
                continue
            s = prod_stats.setdefault(pid, {"productId": pid, "name": it.get('name'), "quantity": 0, "revenue": 0})
            s['quantity'] += it.get('quantity', 0)
            s['revenue'] += it.get('price', 0) * it.get('quantity', 0)
    top_products = sorted(prod_stats.values(), key=lambda x: x['revenue'], reverse=True)[:5]

    recent_orders = sorted(all_orders, key=lambda o: o.get('createdAt', ''), reverse=True)[:8]

    # Orders by status
    status_counts = {}
    for o in all_orders:
        s = o.get('status', 'pending')
        status_counts[s] = status_counts.get(s, 0) + 1

    return {
        "totalRevenue": total_revenue,
        "totalOrders": total_orders,
        "pendingOrders": pending_orders,
        "deliveredOrders": delivered_orders,
        "totalProducts": len(products),
        "totalCustomers": customers_count,
        "lowStockCount": len(low_stock),
        "outOfStockCount": len(out_of_stock),
        "lowStockProducts": low_stock[:10],
        "outOfStockProducts": out_of_stock[:10],
        "salesLast30Days": days,
        "topProducts": top_products,
        "recentOrders": recent_orders,
        "statusCounts": status_counts,
    }


# ============== PUBLIC CONFIG ==============
@api_router.get("/config")
async def get_config():
    return {
        "whatsappNumber": WHATSAPP_NUMBER,
        "currency": "FCFA",
        "brand": "Alixco Luxe",
    }


@api_router.get("/")
async def root():
    return {"message": "Alixco Luxe API", "status": "ok"}


# ============== SEED ==============
async def seed_data():
    # Admin
    if not await db.admins.find_one({"email": "admin@alixcoluxe.com"}):
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": "admin@alixcoluxe.com",
            "password": hash_password("AlixcoAdmin2026!"),
            "fullName": "Administrateur Alixco",
            "createdAt": now_iso(),
        })
        logger.info("Admin créé: admin@alixcoluxe.com")

    # Categories
    default_cats = [
        {"name": "Tableaux personnalisés", "slug": "tableaux", "description": "Tableaux et œuvres d'art sur mesure", "icon": "🖼️"},
        {"name": "Gravure bois", "slug": "gravure-bois", "description": "Gravure artisanale sur bois", "icon": "🪵"},
        {"name": "Gravure métal", "slug": "gravure-metal", "description": "Gravure de précision sur métal", "icon": "⚙️"},
        {"name": "Bijoux personnalisés", "slug": "bijoux", "description": "Bijoux uniques gravés à la main", "icon": "💍"},
        {"name": "Vêtements personnalisés", "slug": "vetements", "description": "Vêtements sur mesure et personnalisation", "icon": "👕"},
        {"name": "Accessoires", "slug": "accessoires", "description": "Accessoires artisanaux personnalisés", "icon": "🎁"},
    ]
    cat_map = {}
    for c in default_cats:
        existing = await db.categories.find_one({"slug": c['slug']})
        if existing:
            cat_map[c['slug']] = existing['id']
        else:
            cat = {"id": str(uuid.uuid4()), **c, "createdAt": now_iso()}
            await db.categories.insert_one(cat)
            cat_map[c['slug']] = cat['id']
    logger.info("Catégories seed OK")

    # Demo products if empty
    if await db.products.count_documents({}) == 0:
        demo = [
            {
                "name": "Tableau gravé sur bois — Portrait",
                "description": "Tableau personnalisé gravé sur bois massif, finition artisanale. Idéal pour un cadeau d'exception.",
                "price": 35000,
                "categoryId": cat_map['tableaux'],
                "images": ["https://images.unsplash.com/photo-1580128637123-07e5a16b9f08?auto=format&fit=crop&w=1200&q=80"],
                "stock": 10,
                "featured": True,
                "material": "Bois d'acajou",
                "dimensions": "30x40 cm",
            },
            {
                "name": "Plaque métal gravée — Personnalisée",
                "description": "Plaque en métal gravée avec votre texte ou logo. Qualité premium, finitions soignées.",
                "price": 18000,
                "categoryId": cat_map['gravure-metal'],
                "images": ["https://images.unsplash.com/photo-1620231107373-74a8bf65f3f4?auto=format&fit=crop&w=1200&q=80"],
                "stock": 15,
                "featured": True,
                "material": "Laiton",
                "dimensions": "15x10 cm",
            },
            {
                "name": "Bracelet en bois gravé",
                "description": "Bracelet artisanal en bois gravé avec prénom ou motif personnalisé.",
                "price": 8500,
                "categoryId": cat_map['bijoux'],
                "images": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80"],
                "stock": 25,
                "featured": True,
                "material": "Bois d'ébène",
            },
            {
                "name": "Pendentif métal gravé",
                "description": "Pendentif élégant en métal gravé à la main avec message personnalisé.",
                "price": 12000,
                "categoryId": cat_map['bijoux'],
                "images": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"],
                "stock": 20,
                "featured": False,
                "material": "Acier inoxydable",
            },
            {
                "name": "T-shirt personnalisé",
                "description": "T-shirt en coton 100% avec personnalisation de texte ou impression.",
                "price": 6500,
                "categoryId": cat_map['vetements'],
                "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
                "stock": 50,
                "featured": True,
                "material": "Coton 100%",
            },
            {
                "name": "Boîte en bois gravée",
                "description": "Magnifique boîte cadeau en bois gravée, idéale pour les présents spéciaux.",
                "price": 15000,
                "categoryId": cat_map['accessoires'],
                "images": ["https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?auto=format&fit=crop&w=1200&q=80"],
                "stock": 12,
                "featured": False,
                "material": "Bois de teck",
                "dimensions": "20x15x8 cm",
            },
            {
                "name": "Porte-clés gravé",
                "description": "Porte-clés en bois ou métal avec gravure personnalisée. Cadeau parfait pour toute occasion.",
                "price": 3500,
                "categoryId": cat_map['accessoires'],
                "images": ["https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?auto=format&fit=crop&w=1200&q=80"],
                "stock": 80,
                "featured": False,
                "material": "Bois / Métal",
            },
            {
                "name": "Tableau citation personnalisée",
                "description": "Tableau avec votre citation favorite gravée sur bois. Décoration unique pour votre intérieur.",
                "price": 22000,
                "categoryId": cat_map['tableaux'],
                "images": ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"],
                "stock": 8,
                "featured": False,
                "material": "Bois",
                "dimensions": "25x35 cm",
            },
        ]
        for d in demo:
            prod = {
                "id": str(uuid.uuid4()),
                "name": d['name'],
                "description": d['description'],
                "price": d['price'],
                "categoryId": d['categoryId'],
                "images": d['images'],
                "stock": d['stock'],
                "featured": d['featured'],
                "customizable": True,
                "active": True,
                "material": d.get('material'),
                "dimensions": d.get('dimensions'),
                "createdAt": now_iso(),
                "updatedAt": now_iso(),
            }
            await db.products.insert_one(prod)
        logger.info("Produits demo seed OK")

    # Services
    if await db.services.count_documents({}) == 0:
        svcs = [
            {"name": "Gravure sur bois", "description": "Gravure artisanale personnalisée sur différents types de bois (acajou, teck, ébène).", "priceFrom": 5000, "priceTo": 50000, "icon": "🪵", "featured": True},
            {"name": "Gravure sur métal", "description": "Gravure de précision sur laiton, acier et autres métaux pour plaques, bijoux, etc.", "priceFrom": 8000, "priceTo": 45000, "icon": "⚙️", "featured": True},
            {"name": "Création de tableaux", "description": "Création de tableaux personnalisés avec gravure, peinture et finitions sur mesure.", "priceFrom": 15000, "priceTo": 80000, "icon": "🎨", "featured": True},
            {"name": "Personnalisation de bijoux", "description": "Gravure de bijoux existants ou création de bijoux uniques personnalisés.", "priceFrom": 3000, "priceTo": 30000, "icon": "💍", "featured": False},
            {"name": "Personnalisation de vêtements", "description": "Personnalisation de vêtements avec impression, broderie ou gravure sur accessoires.", "priceFrom": 2500, "priceTo": 15000, "icon": "👕", "featured": False},
            {"name": "Accessoires personnalisés", "description": "Création et personnalisation d'accessoires: porte-clés, boîtes cadeaux, souvenirs, etc.", "priceFrom": 2000, "priceTo": 25000, "icon": "🎁", "featured": False},
        ]
        for s in svcs:
            svc = {
                "id": str(uuid.uuid4()),
                **s,
                "images": [],
                "active": True,
                "createdAt": now_iso(),
                "updatedAt": now_iso(),
            }
            await db.services.insert_one(svc)
        logger.info("Services seed OK")


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    try:
        await seed_data()
    except Exception as e:
        logger.error(f"Seed error: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
