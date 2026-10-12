// 網站內容集中在這裡。新增簡報、影片或資源時，只要在 resources 陣列加一筆。
// 檔案放在 public/ 底下，href 寫相對路徑、開頭不加 "/"（例如 public/decks/x/index.html → "decks/x/index.html"），GitHub Pages 才找得到。

export type ResourceKind = "影片" | "簡報" | "資源";

export interface Resource {
  title: string;
  kind: ResourceKind;
  description: string;
  href: string;
  /** 顯示在卡片上的補充資訊，例如長度、頁數、日期 */
  meta?: string;
  /** true = 在新分頁開啟（外部連結、HTML 簡報） */
  external?: boolean;
  /** true = 還沒上線，卡片顯示「即將推出」且不可點 */
  comingSoon?: boolean;
}

export const site = {
  name: "博士班超前部署",
  tagline: "用 AI 來幫助你掌握人生跟課業",
  description:
    "給博士生的 AI 研究工作法：從找研究問題、讀文獻、做分析到寫論文，學會和 AI 一起工作，同時守住研究誠信。",
  speakers: [
    { name: "宋建美", title: "助理教授", role: "主講" },
    { name: "游明勳", title: "碩士生", role: "協助" },
  ],
  film: {
    src: "decks/ai-research-metro/video.mp4",
    poster: "media/ai-research-metro-poster.jpg",
    title: "AI 研究地鐵圖",
    duration: "1 分 10 秒",
    caption: "70 秒看懂 AI 怎麼陪你跑完整條研究線：找問題、讀文獻、做分析、寫論文。",
  },
};

export const resources: Resource[] = [
  {
    title: "AI 研究地鐵圖｜開場影片",
    kind: "影片",
    description: "AI 的發展、現在的用法，以及博士研究最值得用 AI 的四個站。",
    href: "decks/ai-research-metro/video.mp4",
    meta: "1 分 10 秒",
    external: true,
  },
  {
    title: "AI 研究地鐵圖｜簡報",
    kind: "簡報",
    description: "16 頁 HTML 簡報，含每站可照抄的指令、三條使用規則與給老師的 Q&A。",
    href: "decks/ai-research-metro/index.html",
    meta: "16 頁 · 方向鍵換頁",
    external: true,
  },
  {
    title: "更多簡報",
    kind: "簡報",
    description: "後續課程的簡報會陸續放在這裡。",
    href: "#",
    comingSoon: true,
  },
  {
    title: "工具與參考資源",
    kind: "資源",
    description: "文獻搜尋、讀 PDF、資料分析等 AI 工具清單與使用指引。",
    href: "#",
    comingSoon: true,
  },
];
