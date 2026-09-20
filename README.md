🔴 Problem Statement

Farmers often face difficulties in getting agricultural equipment such as tractors, harvesters, pumps and other machinery when they need them, especially during important farming periods.

At the same time, equipment owners may have machinery available for rental but may not have an effective way to make its availability visible to nearby farmers.

This creates a gap:

Farmer needs equipment → Equipment owner has equipment → But they cannot easily find each other.

Farmers may also need updated information about crop market prices before deciding where and when to sell their produce.


💡 Our Solution

KrushiConnect is a web-based platform designed to connect:

👨‍🌾 Farmers ↔ 🚜 Agricultural Equipment Owners
Equipment owners can list their agricultural machinery with relevant information such as:

Equipment type

Availability

Location

Rental details

Farmers can search for suitable equipment according to their requirements.

The platform also provides crop market price information to help farmers access market information while making selling decisions.


✨ Key Features





<img width="1312" height="1199" alt="image" src="https://github.com/user-attachments/assets/c59eabdb-357b-4cdc-8c00-892e0d8f5741" />






📊 Market Price Information

KrushiConnect provides crop market price information so that farmers can check available market information while planning their selling decisions.

The e-NAM platform provides live price information with state, commodity and APMC-wise data, including minimum, modal and maximum prices.

📚 Research Reference

1.Research Paper: Status of Farm Mechanization     in India: An Analytical 
Study Author: Meghna Verma (2026)

Page 7 – Current Status

Farm mechanization in India is developing but varies across regions and farm sizes.

Small and marginal farmers face difficulties in accessing agricultural machinery.

Custom Hiring Centres (CHCs) can improve farmers' access to machinery without requiring individual ownership. 


.


<img width="1080" height="1376" alt="image" src="https://github.com/user-attachments/assets/22f4bba3-7e28-41de-a6a5-e5054495eab5" />

.





Page 9 – Challenges

High machinery cost is a major barrier for small and marginal farmers.

Small and fragmented landholdings make machinery use difficult.

Limited access to Custom Hiring Centres, repair facilities and suitable machinery affects mechanization.

Affordable and accessible machinery services are needed for inclusive farm mechanization. 

https://mgmpublications.com/uploads/volume/1772709827.pdf

DOI:
Article DOI: 10.62823/IJAER/2026/02.01.148

DOI URL: https://doi.org/10.62823/IJAER/2026/02.01.148


.


<img width="1080" height="1528" alt="image" src="https://github.com/user-attachments/assets/ba8c8f8e-82ce-48d4-9a8d-d7904ec49171" />


.



2.Research Paper: The Future of Agriculture Mechanization Will Be Data Driven

Source: Tractor Manufacturers Association

Page 2

Key Points

The future of agricultural mechanization is becoming increasingly data-driven.

Digital technologies can provide farmers with better information and tools for making farming decisions.

Technologies such as GPS, sensors, robotics and precision agriculture can improve productivity and efficiency.

Data can help reduce wastage and make farming more cost-effective.


.



<img width="587" height="747" alt="image" src="https://github.com/user-attachments/assets/3c65402e-b44b-4aa7-9462-e0be57d6dd70" />

.



📄 Page 3

Key Points

Modern agricultural machinery can be connected with digital technologies and data systems.

Real-time information can support better decisions related to farm operations and machinery use.

Digital platforms can improve access to information and agricultural services.

Data-driven mechanization can contribute to more efficient and sustainable farming.
 
https://www.tmaindia.in/pdf/The%20Future%20Of%20%20Agriculture%20Mechanization%20Will%20Be%20Data%20Driven.pdf

.


<img width="586" height="752" alt="image" src="https://github.com/user-attachments/assets/9c40bf36-58e8-44c5-91f9-71afe09421d5" />



    .

    

📰 News & Recent Reports

1. Times of India – Gujarat Farmers Turn to Technology to Address Labour Shortage (July 2026)
The report highlights the adoption of farm machinery, digital tools, drones and other technologies to address agricultural labour shortages.

   https://timesofindia.indiatimes.com/city/ahmedabad/sunday-special-gujarat-farmers-turn-to-tech-to-beat-labour-crisis/articleshow/132632898.cms?utm_source=whatsapp&utm_medium=amp_social&utm_campaign=social_share


.

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/f9be78a0-1e66-45db-a3bd-07bc0a485bf7" />



.

2.Indian Express — Small Farmers & Custom Hiring Centre
The article includes an actual Express Photo of a farmer and describes a CHC operated by small and marginal farmers, with machinery available through an affordable rental model. 
 https://indianexpress.com/article/cities/chandigarh/for-small-farmers-custom-hiring-game-changer-10354952/?utm_source=whatsapp&utm_medium=social&utm_campaign=WhatsappShare


.

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/1784ae05-4c22-4f79-bea1-826e098bdc05" />



.


 ## 🛠️ Technology Stack

### 🎨 Frontend

- **React 19** – Frontend UI development
- **TypeScript** – Type-safe development
- **Vite 8** – Build tool and development server
- **React Router DOM v7** – Client-side routing
- **Tailwind CSS v4** – Responsive and modern UI styling
- **Lucide React** – Icons and UI elements
- **Recharts** – Agricultural data visualization and analytics
- **React Context API** – Authentication, application state, and language management
- **Custom Multilingual Translation Engine** – Supports 10 Indian languages:
  English, Hindi, Marathi, Gujarati, Punjabi, Bengali, Telugu, Tamil, Kannada, and Malayalam

### ⚙️ Backend

- **Node.js** – Backend runtime environment
- **Express.js v4** – REST API and server-side framework
- **TypeScript** – Backend development
- **tsx & tsc** – TypeScript execution and production build
- **JWT (JSON Web Token)** – Authentication and authorization
- **bcryptjs** – Secure password hashing
- **CORS** – Cross-Origin Resource Sharing
- **Multer** – File upload and image processing
- **dotenv** – Environment variable management
- **Nodemailer** – Email and OTP verification
- **Resend API** – Transactional email delivery and OTP verification

### 🗄️ Database

- **MongoDB Atlas** – Cloud NoSQL database
- **Mongoose v8** – MongoDB ODM

#### Main Collections / Schemas

- **User** – Farmers and equipment owners with role-based access
- **Equipment** – Agricultural machinery details, pricing, location, availability, and images
- **Booking** – Equipment rental bookings, dates, OTP verification, and payment status
- **Review** – Ratings and user feedback
- **Notification** – Booking, OTP, and payment notifications
- **Maintenance** – Equipment maintenance records
- **UsageLog** – Equipment usage and service tracking
- **Receipt** – Payment receipts and transaction records

### 🔌 APIs & Integrations

- **Internal REST API** – Authentication, equipment, bookings, reviews, notifications, maintenance, usage, planning, analytics, receipts, smart matching, mandi prices, and file uploads
- **data.gov.in API** – Agricultural commodity market prices and APMC/Mandi information
- **Cloudinary API** – Cloud image upload, storage, and CDN delivery
- **Resend API** – Email and OTP verification
- **Translation API** – Dynamic translation of equipment titles and descriptions into regional languages

### 🧰 Tools & Development

- **Git & GitHub** – Version control and source code management
- **npm (Node Package Manager)** – Package and dependency management
- **Visual Studio Code** – Development environment
- **PowerShell** – Command-line development and server management
- **Oxlint & ESLint** – Code quality and linting
- **Render** – Full-stack deployment and hosting




<img width="1312" height="1199" alt="image" src="https://github.com/user-attachments/assets/3825295f-ea54-4770-a7d6-186fb6267d6a" />





# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
