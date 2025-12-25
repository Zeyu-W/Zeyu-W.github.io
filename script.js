// ------------------------------
// 加载博客列表（blogs.html）
// ------------------------------
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

// ------------------------------
// 加载单篇博客内容（blog.html）
// ------------------------------
if (document.getElementById("post-content")) {
  const urlParams = new URLSearchParams(window.location.search);
  const postFile = urlParams.get("post");

  if (!postFile) {
    document.getElementById("post-title").innerText = "Post not found";
    return;
  }

  fetch(`posts/${postFile}`)
    .then(res => res.text())
    .then(md => {
      const converter = new showdown.Converter();
      const html = converter.makeHtml(md);

      document.getElementById("post-title").innerText = postFile.replace(".md", "");
      document.getElementById("post-content").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("post-title").innerText = "Error loading post";
      console.error("加载 Markdown 失败：", err);
    });
}
