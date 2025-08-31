// src/pages/AddPlace.tsx
const FORM_URL = "INSERISCI_QUI_IL_TUO_FORM_URL";

export default function AddPlace() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Inserisci un nuovo luogo</h1>
      <p className="text-gray-600">Compila il modulo qui sotto. Dopo l’invio, il luogo apparirà nel foglio; tu potrai pubblicarlo cambiando la colonna <code>status</code> in <strong>published</strong>.</p>

      {/* Se il form non consente l’embed per X-Frame-Options, mostra il link */}
      <div className="border rounded-lg overflow-hidden">
        <iframe
          src={FORM_URL}
          width="100%"
          height="1200"
          style={{ border: 0 }}
          title="Form Inserimento Luogo"
        />
      </div>

      <a
        href={FORM_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-block mt-2 text-blue-600 underline"
      >
        Apri il modulo in una nuova scheda
      </a>
    </div>
  );
}