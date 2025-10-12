// 读取同名 .md → 注入页面
const mdFile = location.pathname.split('/').pop().replace(/\.html?/i, '.md');

fetch(mdFile)
  .then(r => r.ok ? r.text() : Promise.reject('通知文件不存在'))
  .then(md => {
      // 提取第一行 # 作为页面大标题
      const lines = md.split('\n');
      let title = '通知公告';
      for (const l of lines) if (l.startsWith('# ')) { title = l.slice(2).trim(); break; }
      document.getElementById('page-title').textContent = title;

      // 自定义渲染：每类元素套死字号 & 图标
      const html = marked.parse(md, { breaks: true, gfm: true });

      document.getElementById('content').innerHTML = `
        <div class="notice-card-hover bg-white rounded-xl p-8 shadow-lg border-l-4 border-notice space-y-6">
          <!-- 正文 -->
          <div class="text-gray-700 text-base leading-relaxed">
            ${html
              // 大标题：特大号 + 图标
              .replace(/<h1[^>]*>(.*?)<\/h1>/gi,
                '<h1 class="text-3xl md:text-4xl font-bold text-dark mb-6 flex items-center">' +
                '<i class="fas fa-bullhorn text-notice mr-3"></i>$1</h1>')
              // 二级标题：大号
              .replace(/<h2[^>]*>(.*?)<\/h2>/gi,
                '<h2 class="text-2xl font-semibold text-dark mt-8 mb-4">$1</h2>')
              // 三级标题：中号
              .replace(/<h3[^>]*>(.*?)<\/h3>/gi,
                '<h3 class="text-xl font-semibold text-dark mt-6 mb-3">$1</h3>')
              // 段落：基础字号
              .replace(/<p>/g, '<p class="text-base text-gray-600 leading-relaxed mb-4">')
              // 引用块：左侧彩条 + 淡背景
              .replace(/<blockquote>/g,
                '<blockquote class="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-4 text-gray-700">')
              // 表格：圆角阴影
              .replace(/<table>/g,
                '<table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">')
              // 表头：灰底
              .replace(/<thead>/g, '<thead class="bg-gray-50">')
              .replace(/<th>/g, '<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">')
              // 单元格：常规
              .replace(/<td>/g, '<td class="px-4 py-3 text-sm text-gray-900">')
              // 链接：品牌色 + hover
              .replace(/<a /g, '<a class="text-primary hover:text-accent font-medium" ')
              // 列表：紧凑圆点
              .replace(/<ul>/g, '<ul class="list-disc pl-6 space-y-1 text-base text-gray-600">')
              .replace(/<ol>/g, '<ol class="list-decimal pl-6 space-y-1 text-base text-gray-600">')
            }
          </div>

          <!-- 签名区：右对齐 + 上边框 -->
        </div>
      `;
  })
  .catch(err => {
      document.getElementById('content').innerHTML = `
        <div class="text-center text-red-500">
          <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
          <p class="text-lg">未能加载通知内容</p>
          <p class="text-sm text-gray-500">${err}</p>
        </div>
      `;
  });
