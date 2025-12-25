// 加载博客列表
if (document.getElementById("blog-list")) {
  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById("blog-list");

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
    });
}

// 渲染单篇博客
if (document.getElementById("blog-content")) {
  const urlParams = new URLSearchParams(window.location.search);
  const post = urlParams.get("post");

  if (post) {
    fetch(`posts/${post}`)
      .then(res => res.text())
      .then(md => {
        const converter = new showdown.Converter();
        document.getElementById("blog-content").innerHTML = converter.makeHtml(md);

        // 自动设置标题
        const firstLine = md.split("\n")[0].replace(/^#\s*/, "");
        document.getElementById("post-title").innerText = firstLine;
      });
  }
}
