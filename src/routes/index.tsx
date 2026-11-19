import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { FILTERS, PROJECTS, WHATSAPP_DISPLAY, whatsappLink, type Kind } from "@/lib/content";
import marca from "@/assets/marca.png.asset.json";
import arte from "@/assets/arquitetura-ao-entardecer.webp.asset.json";
import { publicAsset } from "@/lib/public-asset";

function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    player.muted = true;
    if (!motionPreference.matches) {
      void player.play().catch(() => {});
    }
    const pauseForReducedMotion = () => {
      if (motionPreference.matches) player.pause();
    };
    motionPreference.addEventListener("change", pauseForReducedMotion);
    return () => motionPreference.removeEventListener("change", pauseForReducedMotion);
  }, []);

  return (
    <>
      <div className="hero-backdrop absolute inset-0" aria-hidden="true">
        <img src={poster} alt="" className="hero-media" fetchPriority="high" />
        {!unavailable && (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="hero-media"
            preload="none"
            muted
            loop
            playsInline
            onError={() => setUnavailable(true)}
          />
        )}
      </div>
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RP Ramalho Construções | Obras e reformas em Planaltina, DF" },
      { name: "description", content: "Construção, reformas, impermeabilização, infraestrutura e acabamentos para condomínios no DF." },
      { property: "og:title", content: "RP Ramalho Construções" },
      { property: "og:description", content: "Do alicerce à entrega: obras e reformas em Planaltina, DF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function TiltCard({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current!; const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`); el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <button ref={ref} onMouseMove={move} onMouseLeave={leave} onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d]">
      {children}
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at var(--gx) var(--gy), color-mix(in oklab, var(--primary) 25%, transparent), transparent 55%)" }} />
    </button>
  );
}

const STEPS = [
  { n: "01", t: "Preparação da base", d: "Caixas, tubulações e bases instaladas antes de fechar o piso." },
  { n: "02", t: "Impermeabilização", d: "Preparação da superfície e aplicação de manta em lajes." },
  { n: "03", t: "Acabamento", d: "Pisos assentados, encontros com paredes e transições." },
];
const SERVICES = [
  { t: "Obras e reformas", d: "Edifícios e reformas em áreas internas, externas e de uso comum." },
  { t: "Impermeabilização", d: "Proteção contra umidade em áreas molhadas e lajes." },
  { t: "Infraestrutura", d: "Terraplenagem, bases, hidráulica, pavimentação e acessos." },
  { t: "Acabamentos", d: "Pisos, revestimentos e finalização de superfícies." },
];

function Index() {
  useReveal();
  const [filter, setFilter] = useState<"todas" | Kind>("todas");
  const [open, setOpen] = useState<{ p: number; i: number } | null>(null);
  const [form, setForm] = useState({ servico: "", cidade: "", msg: "" });
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  const list = PROJECTS.map((p, idx) => ({ ...p, idx })).filter((p) => filter === "todas" || p.kind === filter);
  const message = `Olá! Gostaria de um orçamento.\nServiço: ${form.servico || "-"}\nCidade: ${form.cidade || "-"}\n${form.msg}`;
  const current = open ? PROJECTS[open.p] : null;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#topo" className="flex items-center gap-3">
            <img src={publicAsset(marca.url)} alt="" className="h-9 w-9 rounded-md" />
            <span className="font-display text-sm font-bold tracking-wide">RP RAMALHO</span>
          </a>
          <div className="hidden gap-8 text-sm text-muted-foreground md:flex">
            {[["obras", "Obras"], ["servicos", "Serviços"], ["empresa", "A construtora"]].map(([id, l]) => (
              <a key={id} href={`#${id}`} className="transition-colors hover:text-primary">{l}</a>
            ))}
          </div>
          <a href="#contato" className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-105">Orçamento</a>
        </nav>
      </header>

      <section id="topo" className="relative isolate flex min-h-svh items-center overflow-hidden bg-background text-white">
        <HeroVideo
          src={publicAsset("media/capa-rp-ramalho.mp4")}
          poster={publicAsset("media/capa-rp-ramalho.webp")}
        />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 pb-24 sm:px-10 lg:px-12">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/25 px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-white">
              <span className="size-2 rounded-full bg-primary" /> Construção civil · Planaltina, DF
            </p>
            <h1 className="font-display text-[clamp(1.8rem,7.5vw,5.25rem)] font-extrabold leading-[1.04] tracking-tight">
              RP Ramalho <span className="block text-primary">Construções</span>
            </h1>
            <p className="mt-6 font-display text-lg font-bold sm:text-2xl">Do alicerce à entrega.</p>
            <p className="mt-3 max-w-md text-base text-white/95 sm:text-lg">
              Construção, reformas e melhorias para condomínios e áreas de uso comum.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contato" className="rounded-full bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90">Solicitar orçamento</a>
              <a href="#obras" className="rounded-full border border-white/55 bg-black/25 px-6 py-3.5 font-bold transition-colors hover:bg-black/55">Explorar obras</a>
            </div>
            <div className="mt-9 flex gap-6 border-t border-white/25 pt-5 sm:gap-10">
              {[["2018", "desde"], ["6+", "tipos de obra"], ["DF", "atuação"]].map(([value, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl font-bold text-primary sm:text-3xl">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-white/90">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden border-y border-border py-4">
        <div className="flex w-max gap-12 whitespace-nowrap font-display text-sm uppercase tracking-widest text-muted-foreground motion-safe:animate-marquee">
          {Array.from({ length: 2 }).flatMap((_, k) => ["Obras", "Reformas", "Impermeabilização", "Infraestrutura", "Pavimentação", "Acabamentos", "Hidráulica", "Terraplenagem"].map((w) => <span key={k + w}>✦ {w}</span>))}
        </div>
      </div>

      <section id="obras" className="mx-auto max-w-7xl px-6 py-28">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">Portfólio</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Conheça nossas obras</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${filter === f.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="reveal in animate-rise">
              <TiltCard onClick={() => setOpen({ p: p.idx, i: 0 })}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.photos[0]!.src} alt={p.photos[0]!.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex items-center justify-between p-5">
                  <div><p className="text-xs uppercase tracking-widest text-primary">{p.category}</p><h3 className="mt-1 font-display text-lg font-bold">{p.title}</h3></div>
                  <span className="text-sm text-muted-foreground">{p.photos.length} fotos →</span>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="reveal font-display text-4xl font-bold md:text-5xl">Da preparação <span className="text-gradient">ao acabamento</span></h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="reveal rounded-2xl border border-border bg-background p-8 transition-transform hover:-translate-y-2" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="font-display text-5xl font-extrabold text-primary/40">{s.n}</div>
                <h3 className="mt-6 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-3 text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servicos" className="mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-2">
        <div className="reveal">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Serviços</p>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">O que executamos</h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {SERVICES.map((s) => (
              <a key={s.t} href="#contato" className="group flex items-center justify-between gap-6 py-6">
                <div><h3 className="font-display text-xl font-bold transition-colors group-hover:text-primary">{s.t}</h3><p className="mt-1 text-muted-foreground">{s.d}</p></div>
                <span className="text-2xl transition-transform group-hover:translate-x-2 group-hover:text-primary">→</span>
              </a>
            ))}
          </div>
        </div>
        <div className="reveal overflow-hidden rounded-3xl border border-border">
          <img src={publicAsset(arte.url)} alt="" loading="lazy" className="h-full min-h-64 w-full object-cover" />
        </div>
      </section>

      <section id="empresa" className="mx-auto max-w-7xl px-6 pb-28">
        <div className="reveal grid gap-10 rounded-3xl border border-border bg-card p-10 md:grid-cols-2 md:p-14">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary">A construtora</p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">RP Ramalho Construções</h2>
            <p className="mt-5 text-muted-foreground">Com sede em Planaltina, no Distrito Federal, atuamos na construção civil desde 2018 em acessos e áreas comuns, impermeabilização, infraestrutura e acabamento.</p>
          </div>
          <dl className="grid grid-cols-2 gap-6 text-sm">
            {[["CNPJ", "30.131.781/0001-14"], ["Abertura", "20/06/2018"], ["Situação", "Ativa"], ["Sede", "Planaltina, DF"]].map(([a, b]) => (
              <div key={a} className="rounded-xl border border-border p-5"><dt className="text-muted-foreground">{a}</dt><dd className="mt-1 font-bold">{b}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section id="contato" className="bg-hero py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <div className="reveal">
            <h2 className="font-display text-4xl font-bold md:text-6xl">Vamos falar sobre <span className="text-gradient">sua obra?</span></h2>
            <p className="mt-6 text-muted-foreground">QD 19, Conjunto B, Lote 21 — Setor Residencial Leste · Planaltina, DF</p>
            <p className="mt-2 text-muted-foreground">WhatsApp {WHATSAPP_DISPLAY} · @rpramalhoconstrucoes</p>
          </div>
          <form className="reveal space-y-4 rounded-3xl border border-border bg-card/80 p-8 backdrop-blur" onSubmit={(e) => { e.preventDefault(); window.open(whatsappLink(message), "_blank"); }}>
            <select required value={form.servico} onChange={(e) => setForm({ ...form, servico: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3">
              <option value="">Selecione o serviço</option>
              {["Obras e reformas", "Impermeabilização", "Infraestrutura", "Acabamentos", "Outro serviço"].map((o) => <option key={o}>{o}</option>)}
            </select>
            <input required placeholder="Cidade da obra" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3" />
            <textarea rows={4} placeholder="O que você precisa?" value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3" />
            <button className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]">Enviar pelo WhatsApp</button>
          </form>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground"><p>© RP Ramalho Construções Ltda.</p><p>Site desenvolvido por <strong>Jefferson Ramalho</strong></p><p><a href="https://wa.me/5583921418988">WhatsApp (83) 92141-8988</a> · <a href="mailto:jeffersonramalhopb@gmail.com">jeffersonramalhopb@gmail.com</a></p></footer>

      {current && open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6 backdrop-blur-md" onClick={() => setOpen(null)}>
          <div className="relative max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={current.photos[open.i]!.src} alt={current.photos[open.i]!.alt} className="max-h-[78vh] rounded-2xl object-contain" />
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{current.title} — {current.photos[open.i]!.alt}</p>
              <div className="flex gap-2">
                <button aria-label="Anterior" onClick={() => setOpen({ ...open, i: (open.i - 1 + current.photos.length) % current.photos.length })} className="rounded-full border border-border px-4 py-2">←</button>
                <button aria-label="Próxima" onClick={() => setOpen({ ...open, i: (open.i + 1) % current.photos.length })} className="rounded-full border border-border px-4 py-2">→</button>
                <button aria-label="Fechar" onClick={() => setOpen(null)} className="rounded-full bg-primary px-4 py-2 text-primary-foreground">×</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
