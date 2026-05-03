#!/usr/bin/env python3
"""
Alixco Luxe - Backend API Test Suite
Tests all API endpoints for the e-commerce platform
"""
import requests
import sys
from datetime import datetime

BASE_URL = "https://shop-manager-303.preview.emergentagent.com/api"

class AlixcoAPITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.customer_token = None
        self.admin_token = None
        self.test_product_id = None
        self.test_order_id = None
        self.test_category_id = None
        self.failures = []

    def test(self, name, method, endpoint, expected_status, data=None, headers=None, params=None):
        """Run a single API test"""
        url = f"{BASE_URL}{endpoint}"
        h = {'Content-Type': 'application/json'}
        if headers:
            h.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Test {self.tests_run}: {name}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=h, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=h, params=params, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=h, params=params, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=h, params=params, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASS - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.tests_failed += 1
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                print(f"❌ FAIL - {error_msg}")
                self.failures.append({"test": name, "error": error_msg})
                return False, {}

        except Exception as e:
            self.tests_failed += 1
            error_msg = f"Exception: {str(e)}"
            print(f"❌ FAIL - {error_msg}")
            self.failures.append({"test": name, "error": error_msg})
            return False, {}

    def run_all_tests(self):
        """Run all test suites"""
        print("=" * 80)
        print("🚀 ALIXCO LUXE - BACKEND API TEST SUITE")
        print("=" * 80)
        
        # 1. Public Config
        self.test_public_config()
        
        # 2. Categories
        self.test_categories()
        
        # 3. Products
        self.test_products()
        
        # 4. Services
        self.test_services()
        
        # 5. Customer Auth
        self.test_customer_auth()
        
        # 6. Orders (Guest)
        self.test_guest_order()
        
        # 7. Orders (Authenticated)
        self.test_authenticated_order()
        
        # 8. Admin Auth
        self.test_admin_auth()
        
        # 9. Admin Products CRUD
        self.test_admin_products()
        
        # 10. Admin Services CRUD
        self.test_admin_services()
        
        # 11. Admin Categories CRUD
        self.test_admin_categories()
        
        # 12. Admin Bulk Price
        self.test_admin_bulk_price()
        
        # 13. Admin Orders
        self.test_admin_orders()
        
        # 14. Admin Customers
        self.test_admin_customers()
        
        # 15. Admin Dashboard
        self.test_admin_dashboard()
        
        # Print summary
        self.print_summary()

    def test_public_config(self):
        print("\n" + "=" * 80)
        print("📋 PUBLIC CONFIG TESTS")
        print("=" * 80)
        
        success, data = self.test("Get config", "GET", "/config", 200)
        if success:
            assert data.get("brand") == "Alixco Luxe", "Brand should be 'Alixco Luxe'"
            assert data.get("whatsappNumber") == "2290197412933", "WhatsApp number mismatch"
            assert data.get("currency") == "FCFA", "Currency should be FCFA"
            print("   ✓ Config data validated")

    def test_categories(self):
        print("\n" + "=" * 80)
        print("📂 CATEGORIES TESTS")
        print("=" * 80)
        
        success, data = self.test("List categories", "GET", "/categories", 200)
        if success:
            assert len(data) == 6, f"Expected 6 categories, got {len(data)}"
            print(f"   ✓ Found {len(data)} categories")
            # Store first category for later tests
            if data:
                self.test_category_id = data[0]['id']

    def test_products(self):
        print("\n" + "=" * 80)
        print("🛍️ PRODUCTS TESTS")
        print("=" * 80)
        
        # List all products
        success, data = self.test("List all products", "GET", "/products", 200)
        if success:
            assert len(data) == 8, f"Expected 8 products, got {len(data)}"
            print(f"   ✓ Found {len(data)} products")
            if data:
                self.test_product_id = data[0]['id']
        
        # Filter by category
        if self.test_category_id:
            self.test("Filter by category", "GET", "/products", 200, 
                     params={"category": self.test_category_id})
        
        # Search products
        self.test("Search products", "GET", "/products", 200, 
                 params={"search": "tableau"})
        
        # Filter by price
        self.test("Filter by price range", "GET", "/products", 200, 
                 params={"minPrice": 5000, "maxPrice": 20000})
        
        # Sort products
        self.test("Sort by price ascending", "GET", "/products", 200, 
                 params={"sort": "price_asc"})
        self.test("Sort by price descending", "GET", "/products", 200, 
                 params={"sort": "price_desc"})
        self.test("Sort by name", "GET", "/products", 200, 
                 params={"sort": "name"})
        
        # Featured products
        self.test("Get featured products", "GET", "/products", 200, 
                 params={"featured": True})
        
        # Get single product
        if self.test_product_id:
            self.test("Get product detail", "GET", f"/products/{self.test_product_id}", 200)

    def test_services(self):
        print("\n" + "=" * 80)
        print("🔧 SERVICES TESTS")
        print("=" * 80)
        
        success, data = self.test("List services", "GET", "/services", 200)
        if success:
            assert len(data) == 6, f"Expected 6 services, got {len(data)}"
            print(f"   ✓ Found {len(data)} services")

    def test_customer_auth(self):
        print("\n" + "=" * 80)
        print("👤 CUSTOMER AUTH TESTS")
        print("=" * 80)
        
        # Register new customer
        timestamp = datetime.now().strftime("%H%M%S")
        email = f"test{timestamp}@example.com"
        success, data = self.test("Register customer", "POST", "/auth/register", 200, data={
            "email": email,
            "password": "TestPass123!",
            "fullName": "Test Customer",
            "phone": "+229 01 23 45 67"
        })
        if success:
            assert "token" in data, "Token missing in register response"
            assert "user" in data, "User missing in register response"
            self.customer_token = data["token"]
            print(f"   ✓ Customer registered: {email}")
        
        # Login with customer
        success, data = self.test("Login customer", "POST", "/auth/login", 200, data={
            "email": email,
            "password": "TestPass123!"
        })
        if success:
            assert "token" in data, "Token missing in login response"
            self.customer_token = data["token"]
            print("   ✓ Customer logged in")
        
        # Get customer profile
        if self.customer_token:
            headers = {"Authorization": f"Bearer {self.customer_token}"}
            self.test("Get customer profile", "GET", "/auth/me", 200, headers=headers)
            
            # Update profile
            self.test("Update customer profile", "PUT", "/auth/profile", 200, 
                     data={"fullName": "Updated Name", "phone": "+229 99 88 77 66"},
                     headers=headers)

    def test_guest_order(self):
        print("\n" + "=" * 80)
        print("🛒 GUEST ORDER TESTS")
        print("=" * 80)
        
        if not self.test_product_id:
            print("⚠️  Skipping guest order test - no product ID available")
            return
        
        success, data = self.test("Create guest order", "POST", "/orders", 200, data={
            "items": [
                {
                    "productId": self.test_product_id,
                    "name": "Test Product",
                    "price": 10000,
                    "quantity": 2,
                    "notes": "Test personalization"
                }
            ],
            "customerName": "Guest Customer",
            "customerPhone": "+229 01 11 22 33",
            "customerEmail": "guest@test.com",
            "customerAddress": "Cotonou, Bénin",
            "deliveryNotes": "Test delivery notes"
        })
        if success:
            assert "order" in data, "Order missing in response"
            assert "whatsappUrl" in data, "WhatsApp URL missing in response"
            order = data["order"]
            assert order.get("orderNumber"), "Order number missing"
            assert order.get("status") == "pending", "Order status should be pending"
            
            # Validate WhatsApp URL format
            whatsapp_url = data["whatsappUrl"]
            assert whatsapp_url.startswith("https://wa.me/2290197412933?text="), "Invalid WhatsApp URL format"
            assert "ALX-" in whatsapp_url, "Order number not in WhatsApp URL"
            print(f"   ✓ Order created: {order['orderNumber']}")
            print(f"   ✓ WhatsApp URL validated")

    def test_authenticated_order(self):
        print("\n" + "=" * 80)
        print("🛒 AUTHENTICATED ORDER TESTS")
        print("=" * 80)
        
        if not self.customer_token or not self.test_product_id:
            print("⚠️  Skipping authenticated order test - missing token or product ID")
            return
        
        headers = {"Authorization": f"Bearer {self.customer_token}"}
        success, data = self.test("Create authenticated order", "POST", "/orders", 200, 
                                 data={
                                     "items": [
                                         {
                                             "productId": self.test_product_id,
                                             "name": "Test Product",
                                             "price": 15000,
                                             "quantity": 1,
                                             "notes": "Authenticated order"
                                         }
                                     ],
                                     "customerName": "Auth Customer",
                                     "customerPhone": "+229 02 22 33 44"
                                 },
                                 headers=headers)
        if success:
            self.test_order_id = data["order"]["id"]
            print(f"   ✓ Authenticated order created")
        
        # Get customer orders
        self.test("Get customer orders", "GET", "/orders/mine", 200, headers=headers)

    def test_admin_auth(self):
        print("\n" + "=" * 80)
        print("👨‍💼 ADMIN AUTH TESTS")
        print("=" * 80)
        
        # Admin login
        success, data = self.test("Admin login", "POST", "/admin/login", 200, data={
            "email": "admin@alixcoluxe.com",
            "password": "AlixcoAdmin2026!"
        })
        if success:
            assert "token" in data, "Token missing in admin login response"
            assert "admin" in data, "Admin missing in response"
            self.admin_token = data["token"]
            print("   ✓ Admin logged in")
        
        # Get admin profile
        if self.admin_token:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            self.test("Get admin profile", "GET", "/admin/me", 200, headers=headers)

    def test_admin_products(self):
        print("\n" + "=" * 80)
        print("🛍️ ADMIN PRODUCTS CRUD TESTS")
        print("=" * 80)
        
        if not self.admin_token:
            print("⚠️  Skipping admin products test - no admin token")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # List all products (admin)
        self.test("Admin list products", "GET", "/admin/products", 200, headers=headers)
        
        # Create product
        success, data = self.test("Admin create product", "POST", "/admin/products", 200, 
                                 data={
                                     "name": "Test Product Admin",
                                     "description": "Test description",
                                     "price": 25000,
                                     "categoryId": self.test_category_id,
                                     "stock": 10,
                                     "featured": False,
                                     "customizable": True,
                                     "active": True
                                 },
                                 headers=headers)
        if success:
            new_product_id = data.get("id")
            print(f"   ✓ Product created: {new_product_id}")
            
            # Update product
            if new_product_id:
                self.test("Admin update product", "PUT", f"/admin/products/{new_product_id}", 200,
                         data={"name": "Updated Product Name", "price": 30000},
                         headers=headers)
                
                # Delete product
                self.test("Admin delete product", "DELETE", f"/admin/products/{new_product_id}", 200,
                         headers=headers)

    def test_admin_services(self):
        print("\n" + "=" * 80)
        print("🔧 ADMIN SERVICES CRUD TESTS")
        print("=" * 80)
        
        if not self.admin_token:
            print("⚠️  Skipping admin services test - no admin token")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # List services (admin)
        self.test("Admin list services", "GET", "/admin/services", 200, headers=headers)
        
        # Create service
        success, data = self.test("Admin create service", "POST", "/admin/services", 200,
                                 data={
                                     "name": "Test Service",
                                     "description": "Test service description",
                                     "priceFrom": 5000,
                                     "priceTo": 15000,
                                     "icon": "🧪",
                                     "featured": False,
                                     "active": True
                                 },
                                 headers=headers)
        if success:
            new_service_id = data.get("id")
            print(f"   ✓ Service created: {new_service_id}")
            
            # Update service
            if new_service_id:
                self.test("Admin update service", "PUT", f"/admin/services/{new_service_id}", 200,
                         data={"name": "Updated Service Name"},
                         headers=headers)
                
                # Delete service
                self.test("Admin delete service", "DELETE", f"/admin/services/{new_service_id}", 200,
                         headers=headers)

    def test_admin_categories(self):
        print("\n" + "=" * 80)
        print("📂 ADMIN CATEGORIES CRUD TESTS")
        print("=" * 80)
        
        if not self.admin_token:
            print("⚠️  Skipping admin categories test - no admin token")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Create category
        success, data = self.test("Admin create category", "POST", "/admin/categories", 200,
                                 data={
                                     "name": "Test Category",
                                     "slug": "test-category",
                                     "description": "Test category description",
                                     "icon": "🧪"
                                 },
                                 headers=headers)
        if success:
            new_category_id = data.get("id")
            print(f"   ✓ Category created: {new_category_id}")
            
            # Update category
            if new_category_id:
                self.test("Admin update category", "PUT", f"/admin/categories/{new_category_id}", 200,
                         data={"name": "Updated Category Name"},
                         headers=headers)
                
                # Delete category
                self.test("Admin delete category", "DELETE", f"/admin/categories/{new_category_id}", 200,
                         headers=headers)

    def test_admin_bulk_price(self):
        print("\n" + "=" * 80)
        print("💰 ADMIN BULK PRICE UPDATE TESTS")
        print("=" * 80)
        
        if not self.admin_token:
            print("⚠️  Skipping bulk price test - no admin token")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # Apply 10% increase to all products
        success, data = self.test("Admin bulk price update (+10%)", "POST", "/admin/products/bulk-price", 200,
                                 data={"percentageChange": 10},
                                 headers=headers)
        if success:
            updated_count = data.get("updated", 0)
            print(f"   ✓ Updated {updated_count} products")
        
        # Apply -10% to revert
        self.test("Admin bulk price update (-10%)", "POST", "/admin/products/bulk-price", 200,
                 data={"percentageChange": -10},
                 headers=headers)

    def test_admin_orders(self):
        print("\n" + "=" * 80)
        print("📦 ADMIN ORDERS TESTS")
        print("=" * 80)
        
        if not self.admin_token:
            print("⚠️  Skipping admin orders test - no admin token")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # List all orders
        success, data = self.test("Admin list all orders", "GET", "/admin/orders", 200, headers=headers)
        if success and data:
            order_id = data[0]["id"]
            
            # Get order detail
            self.test("Admin get order detail", "GET", f"/admin/orders/{order_id}", 200, headers=headers)
            
            # Update order status
            for status in ["confirmed", "in_production", "shipped", "delivered"]:
                self.test(f"Admin update order status to {status}", "PUT", 
                         f"/admin/orders/{order_id}/status", 200,
                         data={"status": status},
                         headers=headers)
        
        # Filter by status
        self.test("Admin filter orders by status", "GET", "/admin/orders", 200,
                 params={"status": "pending"},
                 headers=headers)

    def test_admin_customers(self):
        print("\n" + "=" * 80)
        print("👥 ADMIN CUSTOMERS TESTS")
        print("=" * 80)
        
        if not self.admin_token:
            print("⚠️  Skipping admin customers test - no admin token")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        # List customers
        success, data = self.test("Admin list customers", "GET", "/admin/customers", 200, headers=headers)
        if success and data:
            # Check that ordersCount and totalSpent are present
            customer = data[0]
            assert "ordersCount" in customer, "ordersCount missing in customer data"
            assert "totalSpent" in customer, "totalSpent missing in customer data"
            print(f"   ✓ Customer data includes ordersCount and totalSpent")

    def test_admin_dashboard(self):
        print("\n" + "=" * 80)
        print("📊 ADMIN DASHBOARD TESTS")
        print("=" * 80)
        
        if not self.admin_token:
            print("⚠️  Skipping admin dashboard test - no admin token")
            return
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        
        success, data = self.test("Admin get dashboard", "GET", "/admin/dashboard", 200, headers=headers)
        if success:
            # Validate dashboard data structure
            required_fields = [
                "totalRevenue", "totalOrders", "pendingOrders", "deliveredOrders",
                "totalProducts", "totalCustomers", "lowStockCount", "outOfStockCount",
                "salesLast30Days", "topProducts", "recentOrders", "statusCounts"
            ]
            for field in required_fields:
                assert field in data, f"Dashboard missing field: {field}"
            
            # Validate salesLast30Days has 30 entries
            assert len(data["salesLast30Days"]) == 30, "salesLast30Days should have 30 entries"
            
            print("   ✓ Dashboard data structure validated")
            print(f"   ✓ Total Revenue: {data['totalRevenue']} FCFA")
            print(f"   ✓ Total Orders: {data['totalOrders']}")
            print(f"   ✓ Total Customers: {data['totalCustomers']}")

    def print_summary(self):
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failures:
            print("\n❌ FAILED TESTS:")
            for i, failure in enumerate(self.failures, 1):
                print(f"{i}. {failure['test']}")
                print(f"   Error: {failure['error']}")
        
        print("=" * 80)
        
        return 0 if self.tests_failed == 0 else 1


def main():
    tester = AlixcoAPITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
