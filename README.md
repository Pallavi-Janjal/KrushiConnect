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

📚 References

1. ICAR – Indian Council of Agricultural           Research
   Custom Hiring Centre and farmer-support         initiatives.
   https://www.icar.gov.in/

2. ICAR – Indian Institute of Millets Research
   Integrated Farmer Support Initiative with       Custom Hiring Centre, 24 February 2026.
   https://www.icar.gov.in/en/icar-iimr-           launches-integrated-farmer-support-             initiative-tekmal-fpo-chc-and-scientific-       advisory

3. Press Information Bureau (PIB), Government      of India
   National Farm Mechanisation Policy and          Custom Hiring Centres, 11 August 2026.
   https://www.pib.gov.in/

4. e-NAM – National Agriculture Market
   Agricultural market information and online      trading platform.
   https://enam.gov.in/

5. e-NAM FAQs
   Information about e-NAM, mandis and online      price discovery.
   https://www.enam.gov.in/web/resources/FAQs-     of-eNam

6. ICAR – AICRP on Farm Implements and Machinery
   Research and development related to farm        implements, machinery and custom hiring.
   https://icar.gov.in/en/aicrp-farm-implements-and-machinery

7. JFarm Services
   Farmer-to-farmer agricultural equipment         rental platform.
   https://www.jfarmservices.in/

8. Custom Hiring: The Catalyst for Inclusive       Farm Mechanization and Viksit Bharat
   Indian Farming, ICAR, 2025.

   This paper explains how custom hiring can       reduce the capital burden on farmers,           improve machinery utilization and support       timely farm operations.

   "Research Paper – ICAR Indian Farming"          (https://reference-url-citation.invalid/1)

9. Need for Real-Time Monitoring in Custom         Hiring Centers (CHCs)
   Discover Internet of Things, Springer           Nature, 2025/2026.

   The paper discusses challenges such as peak-    season machinery shortages, inefficient         scheduling and the role of digital              technologies in improving machinery             utilization.

   "Research Paper – Springer Nature"              (https://reference-url-citation.invalid/2)

10. Custom Hiring Services Availed, Constraints     and Suggestions Perceived by the Farmers in     Jabalpur District of Madhya Pradesh
    Asian Journal of Agricultural Extension,        Economics & Sociology, 2022.

    A study of 80 farmers using Custom Hiring       Centres. It identified lack of knowledge        about CHCs and non-availability of              machinery during peak season among the          major constraints reported by respondents.

    "Research Paper – Jabalpur Farmer Study"        (https://reference-url-citation.invalid/4)

11. Empowering Farmers Through Custom Hiring        Centers Indian Farming, ICAR, 2026.

    The paper discusses how Custom Hiring           Centres help reduce the affordability gap       by providing farm machinery on rental           basis, along with challenges such as high       rental cost, low awareness and peak-season      machinery shortages.

    "Research Paper – ICAR Indian Farming 2026"      (https://reference-url-citation.invalid/6)

12. Custom Hiring Centres and the Dream of          Mechanized Farming in India – An Evaluation
    Agricultural Economics Research Review,         2021.

    The study discusses the role of Custom          Hiring Centres in making costly                 agricultural machinery accessible to            farmers who cannot afford individual            ownership.

   "Research Record – FAO AGRIS"                   (https://reference-url-citation.invalid/8)


📰 News & Recent Reports

1. ICAR – Integrated Farmer Support Initiative     at Tekmal FPO
   ICAR reported the launch of a Custom Hiring     Centre and farmer-support initiative to         improve access to farm mechanization and        advisory services.

"Read on ICAR" (https://reference-url-citation.invalid/9)

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
