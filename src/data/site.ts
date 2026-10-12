// 網站內容集中在這裡。新增影片、簡報或資源時，只要在 resources 陣列加一筆，並標上所屬主題（topic）。
// 檔案放在 public/ 底下，href 寫相對路徑、開頭不加 "/"（例如 public/decks/x/index.html → "decks/x/index.html"），GitHub Pages 才找得到。
// 某個主題還沒有影片或簡報時，頁面會自動顯示「即將推出」的空位，不需要手動加。

export type ResourceKind = "影片" | "簡報" | "資源";
export type TopicId = "開場" | "Claude" | "Codex" | "Zotero" | "Notion";

export interface Topic {
  id: TopicId;
  /** 主題大標 */
  name: string;
  /** 一句話說明這個工具在研究上的用途 */
  summary: string;
}

export interface Resource {
  topic: TopicId;
  title: string;
  kind: ResourceKind;
  description: string;
  href: string;
  /** 補充資訊，例如長度、頁數、日期 */
  meta?: string;
  /** true = 在新分頁開啟（影片、HTML 簡報、外部連結） */
  external?: boolean;
  /** true = 已經排定但還沒上線，顯示「即將推出」且不可點 */
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

/** 頁面上主題的排列順序 */
export const topics: Topic[] = [
  { id: "開場", name: "AI 研究地鐵圖", summary: "AI 的發展、現在的用法，以及博士研究最值得用 AI 的四個站。" },
  { id: "Claude", name: "Claude", summary: "讀文獻、寫作的 AI 助理：上傳論文請它整理、比對，還能抓出原文前後矛盾。" },
  { id: "Codex", name: "Codex", summary: "會寫程式的 AI 代理：用說的請它寫 R／Python 分析程式、整理資料、處理重複工作。" },
  { id: "Zotero", name: "Zotero", summary: "免費的文獻管理工具：收集、標註、整理文獻，一鍵產生 APA 引用格式。" },
  { id: "Notion", name: "Notion", summary: "筆記與知識管理：研究日誌、文獻筆記、論文進度，都收在同一個地方。" },
];

export const resources: Resource[] = [
  {
    topic: "開場",
    title: "AI 研究地鐵圖｜開場影片",
    kind: "影片",
    description: "中文旁白與字幕，報告開場使用。",
    href: "decks/ai-research-metro/video.mp4",
    meta: "1 分 10 秒",
    external: true,
  },
  {
    topic: "開場",
    title: "AI 研究地鐵圖｜簡報",
    kind: "簡報",
    description: "每站可照抄的指令、三條使用規則與給老師的 Q&A。",
    href: "decks/ai-research-metro/index.html",
    meta: "16 頁",
    external: true,
  },
  {
    topic: "Claude",
    title: "Claude 新手上路｜介紹影片",
    kind: "影片",
    description: "找官網、註冊、上傳第一篇論文，看它抓出原文的錯誤。",
    href: "decks/claude-starter/video.mp4",
    meta: "1 分 32 秒",
    external: true,
  },
  {
    topic: "Claude",
    title: "Claude 新手上路｜簡報",
    kind: "簡報",
    description: "五個步驟、三件要記住的事，附現場練習用的指令。",
    href: "decks/claude-starter/index.html",
    meta: "13 頁",
    external: true,
  },
  {
    topic: "Codex",
    title: "Codex 新手上路｜介紹影片",
    kind: "影片",
    description: "下載、登入、開專案，用模擬問卷實測跑出統計表與散佈圖。",
    href: "decks/codex-starter/video.mp4",
    meta: "1 分 29 秒",
    external: true,
  },
  {
    topic: "Codex",
    title: "Codex 新手上路｜簡報",
    kind: "簡報",
    description: "可照抄的分析指令、權限與資料安全提醒、三件要記住的事。",
    href: "decks/codex-starter/index.html",
    meta: "16 頁",
    external: true,
  },
  {
    topic: "Zotero",
    title: "Zotero 新手任務 Lv.1｜安裝與基本功能",
    kind: "影片",
    description: "安裝、Chrome 外掛一鍵存文獻、資料夾與標籤、PDF 畫重點、一鍵產生 APA。",
    href: "decks/zotero-starter/video-ep1.mp4",
    meta: "1 分 28 秒",
    external: true,
  },
  {
    topic: "Zotero",
    title: "Zotero 新手任務 Lv.2｜Word 外掛",
    kind: "影片",
    description: "在 Word 插入引用、自動產生文末參考文獻，一鍵把 APA 換成 AMA。",
    href: "decks/zotero-starter/video-ep2.mp4",
    meta: "1 分 04 秒",
    external: true,
  },
  {
    topic: "Zotero",
    title: "Zotero 新手任務｜簡報",
    kind: "簡報",
    description: "十個關卡的操作步驟與真實截圖，附兩個提醒與現場練習，內嵌兩支影片。",
    href: "decks/zotero-starter/index.html",
    meta: "14 頁",
    external: true,
  },
];
