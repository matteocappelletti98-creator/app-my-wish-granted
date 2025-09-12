const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfTDxGRpDNG1JdSwD-fGUgSe3XrT9mO8wE_J-8ISsFhLz2P_g/viewform?embedded=true";

export default function AddPlace() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Inserisci un nuovo luogo</h1>
      <p className="text-gray-600">Compila il modulo qui sotto. Poi, nel foglio, metti <code>status</code> = <b>published</b> per renderlo visibile.</p>
      <div className="border rounded-lg overflow-hidden">
        <iframe src={FORM_URL} width="100%" height="1200" style={{ border: 0 }} title="Form Inserimento Luogo" />
      </div>
      <a href={FORM_URL.replace("&embedded=true","")} target="_blank" rel="noreferrer" className="inline-block mt-2 text-blue-600 underline">
        Apri il modulo in una nuova scheda
      </a>
    </div>
  );
}