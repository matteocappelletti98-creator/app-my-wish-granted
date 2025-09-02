import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { MY_CSV_URL } from "@/config";
import { v4 as uuidv4 } from "uuid";

type Article = { id:string; title:string; content:string; img?:string; poiSlug?:string; createdAt:number };

function loadArticles(): Article[] {
  try { return JSON.parse(localStorage.getItem("blog_articles") || "[]"); } catch { return []; }
}
function saveArticles(list: Article[]){ localStorage.setItem("blog_articles", JSON.stringify(list)); }

export default function Blog(){
  const [articles, setArticles] = useState<Article[]>(loadArticles());
  const [allPoi, setAllPoi] = useState<Place[]>([]);
  const [params, setParams] = useSearchParams();
  const linkPoiSlug = params.get("link") || undefined;
  const editId = params.get("edit") || undefined;

  useEffect(() => { (async () => {
    try { setAllPoi(await fetchPlacesFromSheet(MY_CSV_URL)); } catch {}
  })(); }, []);

  function onCreate(a: Article){
    const next = [a, ...articles];
    setArticles(next); saveArticles(next);
  }
  function onUpdate(a: Article){
    const next = articles.map(x => x.id === a.id ? a : x);
    setArticles(next); saveArticles(next);
  }

  const editing = useMemo(() => articles.find(a => a.id === editId), [articles, editId]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-blue-700">Blog</h1>
        <NewArticleButton allPoi={allPoi} defaultPoiSlug={linkPoiSlug} onCreate={onCreate} />
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-600">Nessun articolo ancora. Clicca <span className="font-medium">“Crea il tuo articolo”</span> per iniziare.</p>
      ) : (
        <div className="space-y-4">
          {articles.map(a => (
            <div key={a.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{a.title}</div>
                  <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
                  {a.poiSlug && <div className="text-xs mt-1">Collegato a: <Link to={`/poi/${a.poiSlug}?ctx=my`} className="underline">{a.poiSlug}</Link></div>}
                </div>
                <EditArticleButton article={a} allPoi={allPoi} onUpdate={onUpdate} />
              </div>
              {a.img && <img src={a.img} alt="" className="mt-3 rounded-md border max-h-64 object-cover" />}
              <p className="mt-3 whitespace-pre-wrap text-gray-700">{a.content}</p>
            </div>
          ))}
        </div>
      )}

      {editing && <EditArticleModal article={editing} allPoi={allPoi} onUpdate={(a)=>{ onUpdate(a); params.delete("edit"); setParams(params, { replace:true }); }} />}
    </div>
  );
}

function NewArticleButton({ allPoi, defaultPoiSlug, onCreate }:{ allPoi:Place[]; defaultPoiSlug?:string; onCreate:(a:any)=>void }){
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={()=>setOpen(true)} className="px-3 py-2 rounded-md border hover:bg-gray-50">Crea il tuo articolo</button>
      {open && <ArticleModalBase
        title="Nuovo articolo"
        allPoi={allPoi}
        defaultPoiSlug={defaultPoiSlug}
        onClose={()=>setOpen(false)}
        onSubmit={(data)=>{
          onCreate({ id: uuidv4(), createdAt: Date.now(), ...data });
          setOpen(false);
        }}
      />}
    </>
  );
}

function EditArticleButton({ article, allPoi, onUpdate }:{ article: any; allPoi: Place[]; onUpdate:(a:any)=>void }){
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={()=>setOpen(true)} className="px-3 py-2 rounded-md border hover:bg-gray-50">Modifica</button>
      {open && <ArticleModalBase
        title="Modifica articolo"
        allPoi={allPoi}
        defaultPoiSlug={article.poiSlug}
        defaultTitle={article.title}
        defaultContent={article.content}
        defaultImg={article.img}
        onClose={()=>setOpen(false)}
        onSubmit={(data)=>{ onUpdate({ ...article, ...data }); setOpen(false); }}
      />}
    </>
  );
}

function ArticleModalBase({
  title, allPoi, defaultPoiSlug, defaultTitle="", defaultContent="", defaultImg, onClose, onSubmit
}:{
  title:string;
  allPoi: Place[];
  defaultPoiSlug?: string;
  defaultTitle?: string;
  defaultContent?: string;
  defaultImg?: string;
  onClose: ()=>void;
  onSubmit: (data:{ title:string; content:string; img?:string; poiSlug?:string })=>void;
}){
  const [t, setT] = useState(defaultTitle);
  const [c, setC] = useState(defaultContent);
  const [img, setImg] = useState<string|undefined>(defaultImg);
  const [poiSlug, setPoiSlug] = useState<string|undefined>(defaultPoiSlug);

  async function onPickImage(e:any){
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setImg(b64);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border w-full max-w-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="px-2 py-1 rounded-md border hover:bg-gray-50">Chiudi</button>
        </div>

        <label className="block text-sm">Titolo</label>
        <input value={t} onChange={e=>setT(e.target.value)} className="w-full border rounded-md px-3 py-2" placeholder="Il mio racconto..." />

        <label className="block text-sm">Contenuto</label>
        <textarea value={c} onChange={e=>setC(e.target.value)} className="w-full border rounded-md px-3 py-2 h-40" placeholder="Scrivi qui..." />

        <label className="block text-sm">Immagine (opzionale)</label>
        <input type="file" accept="image/*" onChange={onPickImage} />
        {img && <img src={img} alt="" className="rounded-md border max-h-48 object-cover" />}

        <label className="block text-sm">Collega a un POI (my.explore)</label>
        <select className="w-full border rounded-md px-3 py-2" value={poiSlug || ""} onChange={e => setPoiSlug(e.target.value || undefined)}>
          <option value="">— Nessun collegamento —</option>
          {allPoi.map(p => <option key={p.id} value={p.slug}>{p.name} — {p.city}</option>)}
        </select>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md border">Annulla</button>
          <button
            onClick={() => onSubmit({ title:t.trim(), content:c.trim(), img, poiSlug })}
            className="px-3 py-2 rounded-md border bg-blue-50"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}

function fileToBase64(file:File): Promise<string>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
