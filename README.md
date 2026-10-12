# 博士班超前部署｜官方網站

React + Vite + Tailwind CSS + TypeScript。

## 開發與建置

```bash
npm install
npm run dev      # 本機預覽 http://localhost:5173
npm run build    # 產出 dist/，整個資料夾可以直接上傳到任何靜態網站主機
```

## 新增簡報、影片或資源

1. 把檔案放進 `public/`，例如新的 HTML 簡報放在 `public/decks/<名稱>/index.html`。
2. 打開 `src/data/site.ts`，在 `resources` 陣列加一筆：

```ts
{
  title: "第二講｜文獻回顧與 AI",
  kind: "簡報",            // "影片" | "簡報" | "資源"
  description: "一句話說明內容",
  href: "decks/<名稱>/index.html",
  meta: "20 頁",           // 選填
  external: true,          // 在新分頁開啟
},
```

把 `comingSoon: true` 拿掉，卡片就會變成可以點的連結。外部網址（例如 Google 雲端連結）直接寫完整網址即可。

## 其他文字

標語、介紹文字、講者名單、開場影片都在 `src/data/site.ts` 的 `site` 物件裡。

## 部署（GitHub Pages）

推送到 `main` 分支後，GitHub Actions 會自動建置並發佈到 https://bobyu89.github.io/phd-forward/ 。
新增影片或簡報：放進 `public/`、在 `src/data/site.ts` 加一筆，然後 commit、push 即可。單一檔案上限 100 MB。
