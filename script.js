document.addEventListener("DOMContentLoaded", async () => {
  const postsDiv = document.getElementById("posts");
  if (!postsDiv) return;

  const converter = new showdown.Converter();

  try {
    // 读取索引文件
    const indexResponse = await fetch("posts/index.json");
    const postFiles = await indexResponse.json();

    for (const file of postFiles) {
      const response = await fetch("posts/" + file);
      const text = await response.text();

      // 提取元数据
      const metaMatch = text.match(/---([\s\S]*?)---/);
      let title = "Untitled";
      let date = "";
      let content = text;

      if (metaMatch) {
        const meta = metaMatch[1].trim().split("\n");
        meta.forEach(line => {
          const [key, value] = line.split(":").map(s => s.trim());
          if (key === "title") title = value;
          if (key === "date") date = value;
        });
        content = text.replace(metaMatch[0], "").trim();
      }

      // 转换 Markdown -> HTML
      const htmlContent = converter.makeHtml(content);

      // 插入到页面
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.innerHTML = `
        <h2>${title}</h2>
        <small>${date}</small>
        <div>${htmlContent}</div>
      `;
      postsDiv.appendChild(postElement);
    }
  } catch (error) {
    console.error("无法加载日志索引或文件:", error);
  }
});
