// 頁面最下方「學習連結」區的內容。新增連結：在對應分組的 links 加一筆；新增分組：在陣列加一個物件。
// 都是外部網站，會在新分頁開啟。

export interface LearnLink {
  title: string;
  /** 一句話說明這個連結能做什麼 */
  note: string;
  href: string;
}

export interface LinkGroup {
  name: string;
  links: LearnLink[];
}

export const linkGroups: LinkGroup[] = [
  {
    name: "Claude",
    links: [
      { title: "Claude 官網", note: "登入、開始對話，上傳論文請它整理", href: "https://claude.ai" },
      { title: "下載桌面版與手機 App", note: "Windows、Mac、iOS、Android", href: "https://claude.ai/download" },
      { title: "Anthropic 說明中心", note: "帳號、方案與功能的官方說明", href: "https://support.anthropic.com" },
    ],
  },
  {
    name: "Codex",
    links: [
      { title: "Codex 介紹", note: "OpenAI 的程式代理，會寫分析程式、整理資料", href: "https://openai.com/codex/" },
      { title: "在 ChatGPT 使用 Codex", note: "用 ChatGPT 帳號登入就能開始", href: "https://chatgpt.com/codex" },
      { title: "Codex 官方文件", note: "安裝、設定與使用方式", href: "https://developers.openai.com/codex" },
    ],
  },
  {
    name: "Zotero",
    links: [
      { title: "Zotero 下載", note: "電腦版軟體與各瀏覽器外掛都在這一頁", href: "https://www.zotero.org/download/" },
      { title: "Zotero Connector（Chrome）", note: "在期刊、PubMed 頁面一鍵存文獻", href: "https://chromewebstore.google.com/detail/zotero-connector/ekhagklcjbdpajgpjgmbionohlpdbjgc" },
      { title: "快速入門指南", note: "官方的新手教學", href: "https://www.zotero.org/support/quick_start_guide" },
      { title: "Word 外掛使用說明", note: "插入引用、參考文獻、換格式", href: "https://www.zotero.org/support/word_processor_plugin_usage" },
      { title: "引用格式庫", note: "期刊指定的格式在這裡找", href: "https://www.zotero.org/styles" },
    ],
  },
  {
    name: "Notion",
    links: [
      { title: "Notion 官網", note: "研究日誌、文獻筆記、進度管理", href: "https://www.notion.com" },
      { title: "Notion 使用指南", note: "官方教學，從基本頁面到資料庫", href: "https://www.notion.com/help/guides" },
      { title: "Notion 教育方案", note: "學生與教師方案說明", href: "https://www.notion.com/product/notion-for-education" },
    ],
  },
  {
    name: "Obsidian",
    links: [
      { title: "Obsidian 官網與下載", note: "存在自己電腦裡的筆記軟體", href: "https://obsidian.md" },
      { title: "Obsidian 說明文件", note: "官方使用手冊", href: "https://help.obsidian.md" },
    ],
  },
  {
    name: "找文獻",
    links: [
      { title: "PubMed", note: "醫學與護理文獻資料庫，免費", href: "https://pubmed.ncbi.nlm.nih.gov" },
      { title: "Google Scholar", note: "跨領域學術搜尋", href: "https://scholar.google.com" },
      { title: "華藝線上圖書館", note: "中文期刊論文", href: "https://www.airitilibrary.com" },
      { title: "臺灣博碩士論文知識加值系統", note: "國內學位論文", href: "https://ndltd.ncl.edu.tw" },
    ],
  },
  {
    name: "寫作與研究倫理",
    links: [
      { title: "APA Style", note: "APA 第七版官方網站", href: "https://apastyle.apa.org" },
      { title: "APA：如何引用生成式 AI", note: "引用 ChatGPT 等 AI 工具的寫法", href: "https://apastyle.apa.org/blog/how-to-cite-chatgpt" },
      { title: "APA：標題句首大寫", note: "參考文獻標題的大小寫規則", href: "https://apastyle.apa.org/style-grammar-guidelines/capitalization/sentence-case" },
      { title: "ICMJE 投稿建議", note: "作者資格與 AI 使用揭露", href: "https://www.icmje.org/recommendations/" },
      { title: "COPE：作者身分與 AI 工具", note: "AI 不能列為作者的立場聲明", href: "https://publicationethics.org/guidance/cope-position/authorship-and-ai-tools" },
      { title: "EQUATOR Network", note: "各種研究設計的報告指引", href: "https://www.equator-network.org" },
    ],
  },
];
