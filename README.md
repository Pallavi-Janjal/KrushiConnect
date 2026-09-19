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

👨‍🌾 For Farmers

🔍 Search for agricultural equipment

🚜 Find tractors, harvesters, pumps and other machinery

📅 Check equipment availability

💰 View rental information

📊 Access crop market price information

🚜 For Equipment Owners

➕ List agricultural machinery

📝 Add equipment details

📍 Add equipment location

📅 Update availability

💰 Add rental details

👨‍🌾 Make available machinery visible to farmers

🧑‍🌾 Farm planning 


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


Page 9 – Challenges

High machinery cost is a major barrier for small and marginal farmers.

Small and fragmented landholdings make machinery use difficult.

Limited access to Custom Hiring Centres, repair facilities and suitable machinery affects mechanization.

Affordable and accessible machinery services are needed for inclusive farm mechanization. 

https://mgmpublications.com/uploads/volume/1772709827.pdf

DOI:
Article DOI: 10.62823/IJAER/2026/02.01.148

DOI URL: https://doi.org/10.62823/IJAER/2026/02.01.148



2.Research Paper: The Future of Agriculture Mechanization Will Be Data Driven

Source: Tractor Manufacturers Association

Page 2

Key Points

The future of agricultural mechanization is becoming increasingly data-driven.

Digital technologies can provide farmers with better information and tools for making farming decisions.

Technologies such as GPS, sensors, robotics and precision agriculture can improve productivity and efficiency.

Data can help reduce wastage and make farming more cost-effective.


📄 Page 3

Key Points

Modern agricultural machinery can be connected with digital technologies and data systems.

Real-time information can support better decisions related to farm operations and machinery use.

Digital platforms can improve access to information and agricultural services.

Data-driven mechanization can contribute to more efficient and sustainable farming.
 
https://www.tmaindia.in/pdf/The%20Future%20Of%20%20Agriculture%20Mechanization%20Will%20Be%20Data%20Driven.pdf
    

📰 News & Recent Reports

1. ICAR – Integrated Farmer Support Initiative     at Tekmal FPO
   ICAR reported the launch of a Custom Hiring     Centre and farmer-support initiative to         improve access to farm mechanization and        advisory services.

   "Read on ICAR" (https://reference-url-           citation.invalid/9)

2. PIB – National Farm Mechanisation Policy
   Government of India information on farm         mechanisation and support for Custom Hiring     Centres under agricultural mechanisation        initiatives.

   "Read on PIB" (https://reference-url-           citation.invalid/10)

3. Moneycontrol – Farm Labour Shortage and         Tractor Demand

   A 2026 report discussing how farm labour        shortages are contributing to demand for

   agricultural mechanisation and tractors.

   "Read on Moneycontrol" (https://reference-       url-citation.invalid/11)

4. Times of India – New Centres to Provide Farm    Equipment
   
   A report on the establishment of new centres    aimed at improving farmers' access to           agricultural equipment.

   "Read on Times of India" (https://reference-     url-citation.invalid/12)


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
