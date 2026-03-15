# FCS Clothing — Shopify Hydrogen Storefront

This repository is a public showcase for the **FCS Clothing** headless e-commerce platform. While the full production codebase—including custom collection logic, cart management, and CI/CD configurations—is maintained in a private repository for IP protection, this mirror demonstrates the core architectural patterns and lead-capture systems used in the project.

## 🔗 Live Environment
[**https://fcs.clothing**](https://fcs.clothing)  
*Current Status: Pre-launch / Lead Generation Phase*

---

## 🛠 Tech Stack
* **Framework:** [Shopify Hydrogen](https://hydrogen.shopify.dev/) (Remix-based)
* **API:** Shopify Admin & Storefront GraphQL APIs
* **Styling:** Tailwind CSS / CSS-in-JS
* **Hosting:** Shopify Oxygen (Edge Deployment)

## 🏗 Key Features (Showcased)
### 1. Secure Server-Side Actions
The showcased entry point demonstrates secure form processing. It utilizes Remix `ActionFunctionArgs` to keep API interactions on the server, ensuring that **Private Admin Tokens** are never exposed to the client-side bundle.

[Image of a sequence diagram for a server-side form submission in Remix]

### 2. GraphQL Mutation Integration
The signup logic connects directly to the Shopify Admin API to:
* Validate incoming customer data with Regex.
* Programmatically create customer profiles in the Shopify backend.
* Apply marketing tags (`coming-soon-signup`) for automated segmentation.

### 3. Production-Ready UI/UX
* **Loading States:** Uses `useNavigation` to provide real-time UI feedback during API round-trips.
* **Error Handling:** Robust validation for email formats and duplicate entry detection (handling Shopify's `userErrors` specifically).
* **Responsive Design:** A mobile-first, high-performance landing experience with a custom GIF background implementation.

## ⚙️ CI/CD & Infrastructure
The full project utilizes a professional deployment pipeline:
* **Automated Staging:** Branch-based preview environments for QA.
* **Oxygen Deployment:** Leveraging Shopify's global edge network for sub-second page loads.
* **Environment Management:** Strict separation of Public and Private keys via secure Oxygen secrets.

---

### 🔒 Security Note
This repository contains a single-entry point for demonstration purposes. All sensitive environment variables (`PRIVATE_ADMIN_API_TOKEN`, `PUBLIC_STORE_DOMAIN`) are managed via secure server-side contexts and are not hardcoded in the source.

**Developed by George Handyside-Lang**
