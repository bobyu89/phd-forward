// 首頁的課程時程表。調整順序或分鐘數只要改這裡，開始時間會自動往下累加。
// topic 對應 site.ts 的主題，填了就會連到該主題的子分頁；Q&A 這類沒有主題的就不填。

import type { TopicId } from "./site";

export interface ScheduleItem {
  minutes: number;
  title: string;
  /** 這一段要做什麼 */
  note: string;
  topic?: TopicId;
}

export const scheduleTotal = 50;

export const schedule: ScheduleItem[] = [
  { minutes: 5, title: "開場：AI 研究地鐵圖", note: "看開場影片，認識博士研究最值得用 AI 的四個站。", topic: "開場" },
  { minutes: 8, title: "Claude", note: "註冊、上傳第一篇論文，請它整理並抓出原文矛盾。", topic: "Claude" },
  { minutes: 8, title: "Codex", note: "用說的請它寫分析程式，跑出統計表與圖。", topic: "Codex" },
  { minutes: 8, title: "Zotero", note: "裝好軟體與外掛，一鍵存文獻，在 Word 插入引用。", topic: "Zotero" },
  { minutes: 8, title: "Notion", note: "建研究資料庫：文獻追蹤表、閱讀看板與進度管理。", topic: "Notion" },
  { minutes: 8, title: "Obsidian", note: "一篇文獻一則筆記，用連結把概念串成網。", topic: "Obsidian" },
  { minutes: 5, title: "Q&A 與綜合討論", note: "現場提問，以及研究誠信與 AI 使用揭露。" },
];
