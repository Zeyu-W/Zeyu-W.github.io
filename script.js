// ------------------------------
// 加载博客列表（用于 blogs.html）
// ------------------------------
console.log("script.js loaded");

const blogListElement = document.getElementById("blog-list");

if (blogListElement) {
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
      
      // 清空加载提示
      blogListElement.innerHTML = "";

      if (!Array.isArray(posts)) {
        blogListElement.innerHTML = "<li style='color:red;'>Error: posts.json 不是数组结构</li>";
      } else if (posts.length === 0) {
        blogListElement.innerHTML = "<li>暂无博客文章</li>";
      } else {
        posts.forEach(post => {
          const li = document.createElement("li");
          li.innerHTML = `
            <a href="blog.html?post=${post.file}">
              ${post.title} <span style="color:#777;">(${post.date})</span>
            </a>
          `;
          blogListElement.appendChild(li);
        });
      }
    })
    .catch(err => {
      console.error("加载 posts.json 失败：", err);
      blogListElement.innerHTML = "<li style='color:red;'>加载 posts.json 失败，请检查文件是否存在且格式正确。</li>";
    });
}

// ------------------------------
// 加载单篇博客内容（用于 blog.html）
// ------------------------------
const postContentElement = document.getElementById("post-content");

if (postContentElement) {
  console.log("post-content element found, start loading single post");

  const urlParams = new URLSearchParams(window.location.search);
  const postFile = urlParams.get("post");
  console.log("URL post parameter:", postFile);

  if (!postFile) {
    // 如果没有参数，显示提示而不使用 return
    document.getElementById("post-title").innerText = "Post not found";
    postContentElement.innerText = "URL 中缺少 ?post= 参数。";
  } else {
    // 只有在有 postFile 的情况下才执行 fetch
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
        
        // 确保页面已加载 showdown 库
        if (typeof showdown !== 'undefined') {
          const converter = new showdown.Converter();
          const html = converter.makeHtml(md);
          document.getElementById("post-title").innerText = postFile.replace(".md", "");
          postContentElement.innerHTML = html;
        } else {
          postContentElement.innerText = "错误：Showdown 库未加载，无法解析 Markdown。";
        }
      })
      .catch(err => {
        document.getElementById("post-title").innerText = "Error loading post";
        postContentElement.innerText = "加载 Markdown 失败，请确保文件存放在 posts/ 目录下。";
        console.error("加载 Markdown 失败：", err);
      });
  }
}
