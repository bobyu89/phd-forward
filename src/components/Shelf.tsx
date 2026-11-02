import { useState } from "react";
import { resources, topics, type Resource, type TopicId } from "../data/site";

/**
 * 教材書架：開場與五個工具，各是一本書。闔起來是書背；打開是這個主題的全部教材，
 * 每支影片配上它自己的開頭畫面（public/decks 裡原本就有的 poster）。內容都從 site.ts 算出來。
 */

/** 書背的三個相鄰色階，輪流使用 */
const TONES = ["bg-[#E9E9E5]", "bg-[#DFDFDA]", "bg-[#D5D5CF]"];

/** 預設打開 Zotero：管文獻的那一本，和首頁插畫講的是同一件事 */
const DEFAULT_OPEN: TopicId = "Zotero";

export function topicSlug(id: TopicId) {
  return id === "開場" ? "opening" : id.toLowerCase();
}

/** 影片的開頭畫面：decks/x/video.mp4 → decks/x/poster.jpg，video-ep1.mp4 → poster-ep1.jpg */
function posterOf(r: Resource): string | undefined {
  if (r.kind !== "影片") return undefined;
  if (r.href === "decks/ai-research-metro/video.mp4") return "media/ai-research-metro-poster.jpg";
  const m = r.href.match(/^(decks\/[^/]+\/)video(-ep\d+)?\.mp4$/);
  return m ? `${m[1]}poster${m[2] ?? ""}.jpg` : undefined;
}

export const shelfTotals = {
  videos: resources.filter((r) => r.kind === "影片").length,
  decks: resources.filter((r) => r.kind === "簡報").length,
};

function shortTitle(r: Resource) {
  const parts = r.title.split("｜");
  return parts[parts.length - 1];
}

function linkProps(r: Resource) {
  return r.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

function Still({ item }: { item: Resource }) {
  const src = posterOf(item);
  if (!src) return null;
  return (
    <a href={item.href} {...linkProps(item)} className="group block">
      <span className="block overflow-hidden bg-[#000000]">
        <img
          src={src}
          alt={`影片「${shortTitle(item)}」的開頭畫面`}
          width={1920}
          height={1080}
          loading="lazy"
          className="block aspect-video w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </span>
      <span className="mt-2 flex items-baseline justify-between gap-3 text-base text-[#000000]">
        <span className="min-w-0 underline decoration-[#BDBAB3] underline-offset-4 group-hover:decoration-[#000000]">
          {shortTitle(item)}
        </span>
        <span className="shrink-0 text-[#6F6F6F] tabular-nums">{item.meta}</span>
      </span>
      {item.external && <span className="sr-only">（在新分頁開啟）</span>}
    </a>
  );
}

function DeckRow({ item }: { item: Resource }) {
  return (
    <li>
      <a href={item.href} {...linkProps(item)} className="group flex items-baseline justify-between gap-4 py-1.5 text-base text-[#000000]">
        <span className="min-w-0">
          <span className="underline decoration-[#BDBAB3] underline-offset-4 group-hover:decoration-[#000000]">
            {item.title.replace("｜", " ")}
          </span>
        </span>
        <span className="shrink-0 text-sm text-[#6F6F6F] tabular-nums">{item.meta}</span>
        {item.external && <span className="sr-only">（在新分頁開啟）</span>}
      </a>
    </li>
  );
}

export function Shelf() {
  const [open, setOpen] = useState<TopicId>(DEFAULT_OPEN);

  return (
    <div className="flex flex-col gap-1.5 lg:min-h-[34rem] lg:flex-row">
      {topics.map((topic, i) => {
        const isOpen = topic.id === open;
        const items = resources.filter((r) => r.topic === topic.id);
        const videos = items.filter((r) => r.kind === "影片");
        const decks = items.filter((r) => r.kind === "簡報");
        const [lead, ...rest] = videos;
        const panelId = `shelf-${topicSlug(topic.id)}`;
        return (
          <div key={topic.id} className={`shelf-book flex min-w-0 flex-col lg:flex-row ${isOpen ? "lg:flex-1" : "lg:flex-none"}`}>
            <h3 className="contents">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(topic.id)}
                className={`flex shrink-0 items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 lg:w-[4.75rem] lg:flex-col lg:px-0 lg:py-6 ${
                  isOpen ? "bg-[#000000] text-[#FFFFFF]" : `${TONES[i % 3]} text-[#000000] hover:bg-[#CACAC3]`
                }`}
              >
                <span className="font-display text-2xl lg:text-3xl lg:[writing-mode:vertical-rl]" style={{ lineHeight: 1.1 }}>
                  {topic.name}
                </span>
                <span className={`text-sm tabular-nums lg:[writing-mode:vertical-rl] ${isOpen ? "text-[#BDBAB3]" : "text-[#4A4A4A]"}`}>
                  影片 {videos.length}・簡報 {decks.length}
                </span>
              </button>
            </h3>
            <div id={panelId} hidden={!isOpen} className="shelf-page min-w-0 flex-1 bg-[#FFFFFF]">
              <div className="grid gap-8 p-5 sm:p-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-10">
                <div className="min-w-0">{lead && <Still item={lead} />}</div>
                <div className="flex min-w-0 flex-col">
                  <p className="text-lg leading-relaxed text-pretty text-[#000000]">{topic.summary}</p>
                  {decks.length > 0 && (
                    <>
                      <h4 className="mt-8 mb-2 text-base text-[#6F6F6F]">簡報</h4>
                      <ul>
                        {decks.map((d) => (
                          <DeckRow key={d.href} item={d} />
                        ))}
                      </ul>
                    </>
                  )}
                  <a
                    href={`#/topics/${topicSlug(topic.id)}`}
                    className="mt-8 inline-flex w-fit items-center rounded-full bg-[#000000] px-6 py-3 text-sm text-[#FFFFFF] transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
                  >
                    進入 {topic.name} 主題頁
                  </a>
                </div>
                {rest.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 xl:col-span-2">
                    {rest.map((v) => (
                      <Still key={v.href} item={v} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
