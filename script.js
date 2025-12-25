// ------------------------------
// 加载博客列表（blogs.html）
// ------------------------------
console.log("script.js loaded");

if (document.getElementById("blog-list")) {
  console.log("blog-list element found, start fetching posts.json");

  fetch("posts.json")
    .then(res => {
      console.log("posts.json fetch status:", res.status);
      if (!res.ok) {
        throw new Error("HTTP status " + res.status);
      }
      return res.json();
    })
    .then(posts => {
      console.log("posts.json parsed, value:", posts);
      const list = document.getElementById("blog-list");

      if (!Array.isArray(posts)) {
        list.innerHTML = "<li style='color:red;'>Error: posts.json 不是数组结构</li>";
        return;
      }

      if (posts.length === 0) {
        list.innerHTML = "<li>暂无博客文章</li>";
        return;
      }

      posts.forEach(post => {
        const li = document.createElement("li");
        li.innerHTML = `
          <a href="blog.html?post=${post.file}">
            ${post.title} <span style="color:#777;">(${post.date})</span>
          </a>
        `;
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error("加载 posts.json 失败：", err);
      const list = document.getElementById("blog-list");
      list.innerHTML = "<li style='color:red;'>加载 posts.json 失败，请打开控制台查看具体错误。</li>";
    });
}

// ------------------------------
// 加载单篇博客内容（blog.html）
// ------------------------------
if (document.getElementById("post-content")) {
  console.log("post-content element found, start loading single post");

  const urlParams = new URLSearchParams(window.location.search);
  const postFile = urlParams.get("post");
  console.log("URL post parameter:", postFile);

  if (!postFile) {
    document.getElementById("post-title").innerText = "Post not found";
    document.getElementById("post-content").innerText = "URL 中缺少 ?post= 参数。";
    return;
  }

  fetch(`posts/${postFile}`)
    .then(res => {
      console.log(`fetch posts/${postFile} status:`, res.status);
      if (!res.ok) {
        throw new Error("HTTP status " + res.status);
      }
      return res.text();
    })
    .then(md => {
      console.log("Markdown loaded, length:", md.length);
      const converter = new showdown.Converter();
      const html = converter.makeHtml(md);

      document.getElementById("post-title").innerText = postFile.replace(".md", "");
      document.getElementById("post-content").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("post-title").innerText = "Error loading post";
      document.getElementById("post-content").innerText = "加载 Markdown 失败，请打开控制台查看具体错误。";
      console.error("加载 Markdown 失败：", err);
    });
}
