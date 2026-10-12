import { LoopingVideo } from "./components/LoopingVideo";
import { resources, site, topics, type Resource, type ResourceKind, type Topic } from "./data/site";

const HERO_VIDEO = "media/hero-landscape.mp4";

const NAV = [
  { label: "首頁", href: "#top", active: true },
  { label: "開場影片", href: "#film" },
  { label: "系列主題", href: "#topics" },
  { label: "講者", href: "#speakers" },
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
      <a href="#top" className="font-display text-2xl tracking-tight whitespace-nowrap text-[#000000] sm:text-3xl">
        {site.name}
      </a>
      <ul className="hidden items-center gap-8 md:flex">
        {NAV.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`text-sm transition-colors ${
                item.active ? "text-[#000000]" : "text-[#6F6F6F] hover:text-[#000000]"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#topics"
        className="shrink-0 rounded-full bg-[#000000] px-6 py-2.5 text-sm text-[#FFFFFF] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
      >
        開始探索
      </a>
    </nav>
  );
}

function Hero() {
  return (
    <section
      className="relative z-10 flex flex-col items-center justify-center px-6 pb-40 text-center"
      style={{ paddingTop: "calc(8rem - 75px)" }}
    >
      <h1
        className="animate-fade-rise max-w-7xl font-display text-5xl font-normal text-balance text-[#000000] sm:text-7xl md:text-8xl"
        style={{ lineHeight: 1.08, letterSpacing: "-2.46px" }}
      >
        用 <em className="pr-1 text-[#6F6F6F]">AI</em> 來幫助你
        <br />
        掌握<span className="text-[#6F6F6F]">人生</span>跟<span className="text-[#6F6F6F]">課業</span>
      </h1>
      <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-pretty text-[#6F6F6F] sm:text-lg">
        {site.description}
      </p>
      <a
        href="#film"
        className="animate-fade-rise-delay-2 mt-12 rounded-full bg-[#000000] px-14 py-5 text-base text-[#FFFFFF] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
      >
        觀看開場影片
      </a>
      <p className="animate-fade-rise-delay-2 mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1 rounded-full bg-white/75 px-6 py-2 text-sm text-[#3F3F3F] backdrop-blur-md">
        {site.speakers.map((s) => (
          <span key={s.name} className="whitespace-nowrap">
            {s.role}｜{s.name} {s.title}
          </span>
        ))}
      </p>
    </section>
  );
}

function Film() {
  return (
    <section id="film" aria-labelledby="film-title" className="mx-auto max-w-7xl scroll-mt-6 px-5 pt-12 pb-16 sm:px-8 sm:pt-24 sm:pb-28">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <h2
          id="film-title"
          className="font-display text-5xl font-normal text-[#000000] sm:text-6xl md:text-7xl"
          style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
        >
          {site.film.title}
        </h2>
        <p className="text-base leading-relaxed text-pretty text-[#6F6F6F]">
          {site.film.caption}
          <span className="mt-2 block text-sm tabular-nums text-[#000000]">{site.film.duration}　·　中文旁白與字幕</span>
        </p>
      </div>
      <div className="overflow-hidden rounded-[28px] bg-[#000000] shadow-[0_40px_90px_-50px_rgba(0,0,0,0.55)]">
        <video
          className="block aspect-video w-full"
          src={site.film.src}
          poster={site.film.poster}
          controls
          preload="metadata"
          playsInline
          aria-label={`${site.film.title} 開場影片`}
        />
      </div>
    </section>
  );
}

const SLOT_KINDS: ResourceKind[] = ["影片", "簡報"];

/** "系列｜項目" → "項目"; the topic heading already names the series. */
function shortTitle(title: string) {
  const parts = title.split("｜");
  return parts[parts.length - 1];
}

function ResourceLink({ item }: { item: Resource }) {
  const label = (
    <span className="text-sm text-[#6F6F6F] tabular-nums">
      {item.kind}
      {item.meta && <>　·　{item.meta}</>}
    </span>
  );
  if (item.comingSoon) {
    return (
      <li className="flex items-center justify-between gap-6 rounded-2xl border border-dashed border-line px-5 py-5">
        <span className="min-w-0">
          {label}
          <span className="mt-1 block font-display text-2xl text-[#6F6F6F] sm:text-3xl">{shortTitle(item.title)}</span>
        </span>
        <span className="shrink-0 text-sm text-[#6F6F6F]">即將推出</span>
      </li>
    );
  }
  return (
    <li>
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className="group flex items-center justify-between gap-6 rounded-2xl border border-line px-5 py-5 transition-colors duration-200 hover:border-[#000000] hover:bg-[#F6F5F2]"
      >
        <span className="min-w-0">
          {label}
          <span className="mt-1 block font-display text-2xl text-[#000000] sm:text-3xl" style={{ lineHeight: 1.2 }}>
            {shortTitle(item.title)}
          </span>
          <span className="mt-1 block text-base leading-relaxed text-pretty text-[#6F6F6F]">{item.description}</span>
        </span>
        <ArrowIcon className="size-6 shrink-0 text-[#000000] transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
        {item.external && <span className="sr-only">（在新分頁開啟）</span>}
      </a>
    </li>
  );
}

function SlotPlaceholder({ kind }: { kind: ResourceKind }) {
  return (
    <li className="flex items-center justify-between gap-6 rounded-2xl border border-dashed border-line px-5 py-5 text-[#6F6F6F]">
      <span className="text-sm">{kind}</span>
      <span className="text-sm">即將推出</span>
    </li>
  );
}

function TopicRow({ topic }: { topic: Topic }) {
  const items = resources.filter((r) => r.topic === topic.id);
  const extras = items.filter((r) => !SLOT_KINDS.includes(r.kind));
  return (
    <li className="grid gap-8 border-t border-line py-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
      <div>
        <h3 className="font-display text-5xl text-[#000000] sm:text-6xl" style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}>
          {topic.name}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-[#6F6F6F]">{topic.summary}</p>
      </div>
      <ul className="flex flex-col gap-3">
        {SLOT_KINDS.map((kind) => {
          const ofKind = items.filter((r) => r.kind === kind);
          return ofKind.length ? (
            ofKind.map((item) => <ResourceLink key={item.title} item={item} />)
          ) : (
            <SlotPlaceholder key={kind} kind={kind} />
          );
        })}
        {extras.map((item) => (
          <ResourceLink key={item.title} item={item} />
        ))}
      </ul>
    </li>
  );
}

function Topics() {
  return (
    <section id="topics" aria-labelledby="topics-title" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 sm:px-8 sm:py-28">
      <div className="mb-12">
        <h2
          id="topics-title"
          className="font-display text-5xl font-normal text-[#000000] sm:text-6xl md:text-7xl"
          style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
        >
          系列主題
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6F6F6F]">
          開場之後，四個主題各有影片與簡報，陸續更新。
        </p>
      </div>
      <ol className="border-b border-line">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} />
        ))}
      </ol>
    </section>
  );
}

function Speakers() {
  return (
    <section id="speakers" aria-labelledby="speakers-title" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 sm:px-8 sm:py-28">
      <h2
        id="speakers-title"
        className="mb-12 font-display text-5xl font-normal text-[#000000] sm:text-6xl md:text-7xl"
        style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
      >
        講者
      </h2>
      <ul className="border-b border-line">
        {site.speakers.map((s) => (
          <li
            key={s.name}
            className="grid items-baseline gap-2 border-t border-line py-10 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8"
          >
            <span className="text-sm text-[#6F6F6F]">{s.role}</span>
            <span className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <span className="font-display text-6xl text-[#000000] sm:text-7xl" style={{ lineHeight: 1, letterSpacing: "-1.5px" }}>
                {s.name}
              </span>
              <span className="text-lg text-[#6F6F6F]">{s.title}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 pt-10 pb-14 text-sm text-[#6F6F6F] sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <span>© 2026 {site.name}</span>
      <span>{site.tagline}</span>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#film"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[#000000] focus:px-5 focus:py-2.5 focus:text-sm focus:text-[#FFFFFF]"
      >
        跳到主要內容
      </a>
      <header id="top" className="relative min-h-screen w-full overflow-hidden">
        <LoopingVideo src={HERO_VIDEO} />
        <Navbar />
        <Hero />
      </header>
      <main>
        <Film />
        <Topics />
        <Speakers />
      </main>
      <Footer />
    </>
  );
}
