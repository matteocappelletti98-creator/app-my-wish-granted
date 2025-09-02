# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/bf30eae7-9f5b-4d13-91bd-dd93db0e96a3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bf30eae7-9f5b-4d13-91bd-dd93db0e96a3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bf30eae7-9f5b-4d13-91bd-dd93db0e96a3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Aggiornamenti MVP (set 2025)
Questa versione introduce:
1. **Mappa OSM + Brand** — Tile layer sostituito con OpenStreetMap, marker con anello blu brand.
2. **Inserimento coordinate by-click** — In `AddPlace` c'è una mappa cliccabile che precompila il Google Form.
3. **my.explore** — Nuova schermata con la *seconda mappa* e stesso set di funzioni della Home; bottone “+ Inserisci POI”.
4. **Blog** — Schermata per creare articoli (testo + immagini, salvati in `localStorage`) con bottone **“Collega articolo a POI”**. Gli articoli collegati appaiono **solo** nella pagina POI della sezione `my.explore`.
5. **Pagina POI** — Cliccando un POI dalla lista in `my.explore` si apre una pagina dedicata con mappa, descrizione e articoli collegati.

### Configurazione necessaria
- **CSV (Home e My Explore)**: imposta `HOME_CSV_URL` e `MY_CSV_URL` in `src/config.ts` con gli URL CSV pubblicati da Google Sheets.
- **Google Form prefill**: inserisci gli ID `entry` dei campi *latitudine* e *longitudine* (e opzionale *source*) in `src/config.ts`. Se gli ID non sono impostati, apriremo comunque il form ma senza precompilare i valori.
- **Brand**: il colore principale è `#1E66F5`. Puoi modificarlo in `src/config.ts` oppure applicare ulteriori ritocchi CSS.

### Note su SIM vs PROD
- **SIM (questa build)**: dati letti da CSV pubblicati; articoli memorizzati in `localStorage`; nessun backend.
- **PROD**: prevedere una API backend (CRUD POI e articoli), autenticazione, moderazione, e tile server dedicato/Styled OSM se si desidera cambiare lo stile della mappa oltre i controlli UI.

