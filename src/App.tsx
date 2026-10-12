import { useEffect, useState, type ReactNode } from "react";
import { LoopingVideo } from "./components/LoopingVideo";
import { linkGroups } from "./data/links";
import { schedule, scheduleTotal } from "./data/schedule";
import { resources, site, topics, type Resource, type ResourceKind, type Topic, type TopicId } from "./data/site";

const HERO_VIDEO = "media/hero-landscape.mp4";

// ── 路由：用網址 # 後面的路徑切換子分頁（GitHub Pages 不需要伺服器設定）──

type Page = "home" | "topics" | "topic" | "links" | "speakers";
interface Route {
  page: Page;
  topic?: TopicId;
}

/** 主題在網址裡的代稱：「開場」→ opening，其他用小寫英文 */
function topicSlug(id: TopicId) {
  return id === "開場" ? "opening" : id.toLowerCase();
}
function topicHref(id: TopicId) {
  return `#/topics/${topicSlug(id)}`;
}

/** 解析網址；舊版的錨點（#film、#topics…）也對應到新的子分頁，之前分享出去的連結不會失效 */
function parseHash(hash: string): { route: Route; anchor?: string } | null {
  const h = hash.replace(/^#/, "");
  if (h === "" || h === "/" || h === "top") return { route: { page: "home" } };
  if (h === "film" || h === "schedule") return { route: { page: "home" }, anchor: h };
  if (h === "/topics" || h === "topics") return { route: { page: "topics" } };
  if (h === "/links" || h === "links") return { route: { page: "links" } };
  if (h === "/speakers" || h === "speakers") return { route: { page: "speakers" } };
  const m = h.match(/^\/topics\/(.+)$/);
  if (m) {
    const t = topics.find((x) => topicSlug(x.id) === decodeURIComponent(m[1]));
    return { route: t ? { page: "topic", topic: t.id } : { page: "topics" } };
  }
  return null; // 頁內錨點（例如跳到主要內容），不換頁
}

function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash)?.route ?? { page: "home" });
  useEffect(() => {
    const apply = (scrollTop: boolean) => {
      const parsed = parseHash(window.location.hash);
      if (!parsed) return;
      setRoute(parsed.route);
      requestAnimationFrame(() => {
        const el = parsed.anchor ? document.getElementById(parsed.anchor) : null;
        if (el) el.scrollIntoView();
        else if (scrollTop) window.scrollTo(0, 0);
      });
    };
    apply(false);
    const onChange = () => apply(true);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

const NAV: { label: string; href: string; page: Page }[] = [
  { label: "首頁", href: "#/", page: "home" },
  { label: "系列主題", href: "#/topics", page: "topics" },
  { label: "學習連結", href: "#/links", page: "links" },
  { label: "講者", href: "#/speakers", page: "speakers" },
];

const PAGE_TITLES: Record<Page, string> = {
  home: site.name,
  topics: "系列主題",
  topic: "系列主題",
  links: "學習連結",
  speakers: "講者",
};

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Navbar({ current }: { current: Page }) {
  const active = current === "topic" ? "topics" : current;
  return (
    <nav className="relative z-10 mx-auto max-w-7xl px-5 py-6 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <a href="#/" className="font-display text-2xl tracking-tight whitespace-nowrap text-[#000000] sm:text-3xl">
          {site.name}
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={item.page === active ? "page" : undefined}
                className={`text-sm transition-colors ${
                  item.page === active ? "text-[#000000]" : "text-[#6F6F6F] hover:text-[#000000]"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#schedule"
          className="shrink-0 rounded-full bg-[#000000] px-6 py-2.5 text-sm text-[#FFFFFF] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
        >
          課程時程
        </a>
      </div>
      {/* 手機版：導覽改成一排可點的標籤 */}
      <ul className="mt-4 flex flex-wrap gap-2 md:hidden">
        {NAV.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.page === active ? "page" : undefined}
              className={`block rounded-full border px-4 py-1.5 text-sm ${
                item.page === active ? "border-[#000000] bg-[#000000] text-[#FFFFFF]" : "border-line bg-white/75 text-[#3F3F3F]"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
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

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-5xl font-normal text-[#000000] sm:text-6xl md:text-7xl"
      style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}
    >
      {children}
    </h2>
  );
}

function Film() {
  return (
    <section id="film" aria-labelledby="film-title" className="mx-auto max-w-7xl scroll-mt-6 px-5 pt-12 pb-16 sm:px-8 sm:pt-24 sm:pb-28">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <SectionTitle id="film-title">{site.film.title}</SectionTitle>
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

const pad2 = (n: number) => String(n).padStart(2, "0");

/** 時程表每一段的開始、結束分鐘 */
const timedSchedule = (() => {
  let t = 0;
  return schedule.map((item) => {
    const start = t;
    t += item.minutes;
    return { ...item, start, end: t };
  })
})();

function Schedule() {
  return (
    <section id="schedule" aria-labelledby="schedule-title" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 sm:px-8 sm:py-28">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <SectionTitle id="schedule-title">時程表</SectionTitle>
        <p className="text-base leading-relaxed text-pretty text-[#6F6F6F]">
          全程 <span className="text-[#000000] tabular-nums">{scheduleTotal}</span> 分鐘。點主題，可以看該主題的影片、簡報與學習連結。
        </p>
      </div>
      {/* 每一段的長度比例 */}
      <div className="mb-10 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
        {timedSchedule.map((item, i) => (
          <span
            key={item.title}
            className={i % 2 ? "bg-[#BDBAB3]" : "bg-[#000000]"}
            style={{ width: `${(item.minutes / scheduleTotal) * 100}%` }}
          />
        ))}
      </div>
      <ol className="border-b border-line">
        {timedSchedule.map((item) => {
          const inner = (
            <>
              <span className="text-sm text-[#6F6F6F] tabular-nums md:text-base">
                {pad2(item.start)}–{pad2(item.end)} 分
              </span>
              <span className="min-w-0">
                <span className="block font-display text-3xl text-[#000000] sm:text-4xl" style={{ lineHeight: 1.15 }}>
                  {item.title}
                </span>
                <span className="mt-1 block text-base leading-relaxed text-pretty text-[#6F6F6F]">{item.note}</span>
              </span>
              <span className="flex items-center gap-4 text-sm text-[#6F6F6F] tabular-nums">
                {item.minutes} 分鐘
                {item.topic && (
                  <ArrowIcon className="size-6 shrink-0 text-[#000000] transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                )}
              </span>
            </>
          );
          const cls = "grid items-center gap-2 py-7 md:grid-cols-[9rem_minmax(0,1fr)_auto] md:gap-8";
          return (
            <li key={item.title} className="border-t border-line">
              {item.topic ? (
                <a href={topicHref(item.topic)} className={`group -mx-4 rounded-2xl px-4 transition-colors duration-200 hover:bg-[#F6F5F2] ${cls}`}>
                  {inner}
                </a>
              ) : (
                <div className={cls}>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
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

function TopicResources({ topic }: { topic: Topic }) {
  const items = resources.filter((r) => r.topic === topic.id);
  const extras = items.filter((r) => !SLOT_KINDS.includes(r.kind));
  return (
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
  );
}

function TopicRow({ topic }: { topic: Topic }) {
  return (
    <li className="grid gap-8 border-t border-line py-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
      <div>
        <h3 className="font-display text-5xl text-[#000000] sm:text-6xl" style={{ lineHeight: 1.05, letterSpacing: "-1.5px" }}>
          <a href={topicHref(topic.id)} className="group inline-flex items-center gap-3 hover:underline hover:decoration-1 hover:underline-offset-8">
            {topic.name}
          </a>
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-pretty text-[#6F6F6F]">{topic.summary}</p>
        <a href={topicHref(topic.id)} className="mt-5 inline-flex items-center gap-2 text-sm text-[#000000]">
          主題頁 <ArrowIcon className="size-4" />
        </a>
      </div>
      <TopicResources topic={topic} />
    </li>
  );
}

function PageHead({ id, title, lede }: { id: string; title: string; lede?: string }) {
  return (
    <div className="mb-12">
      <SectionTitle id={id}>{title}</SectionTitle>
      {lede && <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-[#6F6F6F]">{lede}</p>}
    </div>
  );
}

function TopicsPage() {
  return (
    <section aria-labelledby="topics-title" className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-28">
      <PageHead id="topics-title" title="系列主題" lede="開場之後，五個主題各有影片與簡報，陸續更新。點主題名稱進入主題頁。" />
      <ol className="border-b border-line">
        {topics.map((topic) => (
          <TopicRow key={topic.id} topic={topic} />
        ))}
      </ol>
    </section>
  );
}

function hostOf(href: string) {
  return new URL(href).hostname.replace(/^www\./, "");
}

function LinkList({ links }: { links: (typeof linkGroups)[number]["links"] }) {
  return (
    <ul className="flex flex-col">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group -mx-3 flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-[#F6F5F2]"
          >
            <span className="min-w-0">
              <span className="block text-lg text-[#000000]">{link.title}</span>
              <span className="block text-sm leading-relaxed text-pretty text-[#6F6F6F]">
                {link.note}
                <span className="text-[#9A9A9A]">　{hostOf(link.href)}</span>
              </span>
            </span>
            <ArrowIcon className="size-5 shrink-0 text-[#000000] transition-transform duration-300 ease-out group-hover:translate-x-1" />
            <span className="sr-only">（在新分頁開啟）</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function TopicPage({ id }: { id: TopicId }) {
  const i = topics.findIndex((t) => t.id === id);
  const topic = topics[i];
  const slot = timedSchedule.find((s) => s.topic === id);
  const group = linkGroups.find((g) => g.name === topic.id || g.name === topic.name);
  const prev = topics[i - 1];
  const next = topics[i + 1];
  return (
    <section aria-labelledby="topic-title" className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-28">
      <a href="#/topics" className="mb-8 inline-flex items-center gap-2 text-sm text-[#6F6F6F] hover:text-[#000000]">
        <ArrowIcon className="size-4 rotate-180" /> 系列主題
      </a>
      <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
        <div>
          <SectionTitle id="topic-title">{topic.name}</SectionTitle>
          <p className="mt-5 max-w-md text-base leading-relaxed text-pretty text-[#6F6F6F]">{topic.summary}</p>
          {slot && (
            <p className="mt-6 inline-block rounded-full border border-line px-4 py-1.5 text-sm text-[#3F3F3F] tabular-nums">
              課程時程　{pad2(slot.start)}–{pad2(slot.end)} 分（{slot.minutes} 分鐘）
            </p>
          )}
        </div>
        <TopicResources topic={topic} />
      </div>
      {group && (
        <div className="mt-16 border-t border-line pt-10">
          <h3 className="mb-4 font-display text-3xl text-[#000000] sm:text-4xl">{topic.name} 學習連結</h3>
          <div className="max-w-3xl">
            <LinkList links={group.links} />
          </div>
        </div>
      )}
      <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line pt-8 text-sm">
        {prev ? (
          <a href={topicHref(prev.id)} className="inline-flex items-center gap-2 text-[#6F6F6F] hover:text-[#000000]">
            <ArrowIcon className="size-4 rotate-180" /> {prev.name}
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={topicHref(next.id)} className="inline-flex items-center gap-2 text-[#6F6F6F] hover:text-[#000000]">
            {next.name} <ArrowIcon className="size-4" />
          </a>
        )}
      </div>
    </section>
  );
}

function SpeakersPage() {
  return (
    <section aria-labelledby="speakers-title" className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-28">
      <PageHead id="speakers-title" title="講者" />
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

function LinksPage() {
  return (
    <section aria-labelledby="links-title" className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-28">
      <PageHead id="links-title" title="學習連結" lede="課程用到的官方網站、下載頁與說明文件，點了會在新分頁開啟。" />
      <div className="grid gap-x-12 border-b border-line md:grid-cols-2">
        {linkGroups.map((group) => (
          <div key={group.name} className="border-t border-line py-8">
            <h3 className="mb-4 font-display text-3xl text-[#000000] sm:text-4xl" style={{ lineHeight: 1.1 }}>
              {group.name}
            </h3>
            <LinkList links={group.links} />
          </div>
        ))}
      </div>
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
  const route = useRoute();
  useEffect(() => {
    const t = route.page === "topic" && route.topic ? topics.find((x) => x.id === route.topic)?.name : PAGE_TITLES[route.page];
    document.title = route.page === "home" ? site.name : `${t}｜${site.name}`;
  }, [route]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[#000000] focus:px-5 focus:py-2.5 focus:text-sm focus:text-[#FFFFFF]"
      >
        跳到主要內容
      </a>
      {route.page === "home" ? (
        <header id="top" className="relative min-h-screen w-full overflow-hidden">
          <LoopingVideo src={HERO_VIDEO} />
          <Navbar current="home" />
          <Hero />
        </header>
      ) : (
        <header className="border-b border-line">
          <Navbar current={route.page} />
        </header>
      )}
      <main id="main">
        {route.page === "home" && (
          <>
            <Film />
            <Schedule />
          </>
        )}
        {route.page === "topics" && <TopicsPage />}
        {route.page === "topic" && route.topic && <TopicPage id={route.topic} />}
        {route.page === "links" && <LinksPage />}
        {route.page === "speakers" && <SpeakersPage />}
      </main>
      <Footer />
    </>
  );
}
