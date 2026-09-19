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
