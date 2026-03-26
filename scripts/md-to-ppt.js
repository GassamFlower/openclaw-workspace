const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// 读取 Markdown 文件
function readMarkdownFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// 解析 Markdown 到 PPT 内容
function markdownToPpt(markdown) {
  const lines = markdown.split('\n');
  const slides = [];
  let currentSlide = null;
  let currentTitle = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const level = getMarkdownLevel(line);

    // 处理标题
    if (level > 0) {
      // 如果有当前幻灯片，先添加到结果
      if (currentSlide) {
        slides.push(currentSlide);
        currentSlide = null;
      }

      // 创建新幻灯片
      const title = getMarkdownTitle(line);
      currentTitle = title;
      currentSlide = {
        title: title,
        content: []
      };
    }
    // 处理内容
    else if (line && currentSlide) {
      // 跳过分隔线
      if (line === '---') continue;

      // 处理列表项
      if (line.startsWith('- ') || line.startsWith('* ')) {
        currentSlide.content.push({
          type: 'bullet',
          text: line.substring(2)
        });
      }
      // 处理加粗文本
      else if (line.startsWith('**') && line.endsWith('**')) {
        currentSlide.content.push({
          type: 'bold',
          text: line.substring(2, line.length - 2)
        });
      }
      // 处理有序列表
      else if (line.match(/^\d+\. /)) {
        currentSlide.content.push({
          type: 'numbered',
          text: line.substring(line.indexOf('. ') + 2)
        });
      }
      // 普通文本（超过一个换行符合并）
      else if (line) {
        currentSlide.content.push({
          type: 'text',
          text: line
        });
      }
    }
  }

  // 添加最后一个幻灯片
  if (currentSlide) {
    slides.push(currentSlide);
  }

  return slides;
}

// 获取 Markdown 标题级别
function getMarkdownLevel(line) {
  if (line.startsWith('# ')) return 1;
  if (line.startsWith('## ')) return 2;
  if (line.startsWith('### ')) return 3;
  if (line.startsWith('#### ')) return 4;
  if (line.startsWith('##### ')) return 5;
  return 0;
}

// 获取标题文本
function getMarkdownTitle(line) {
  for (let i = 0; i < 6; i++) {
    const pattern = '#'.repeat(i + 1) + ' ';
    if (line.startsWith(pattern)) {
      return line.substring(pattern.length);
    }
  }
  return line;
}

// 创建 PPT 文件
async function createPPT(slides, outputFilePath) {
  const pptx = new PptxGenJS();

  // 设置演示文稿信息
  pptx.author = '麻辣虾';
  pptx.title = '博物馆小程序功能演示';
  pptx.company = '景区数字化平台';

  // 创建每个幻灯片
  for (const slideData of slides) {
    const slide = pptx.addSlide();

    // 添加标题
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 1,
      fontSize: 24,
      bold: true,
      color: '363636',
      fontFace: '微软雅黑'
    });

    // 添加内容
    let y = 1.5;
    const content = slideData.content.map(item => {
      if (item.type === 'bullet') {
        return {
          text: item.text,
          bullet: true
        };
      } else if (item.type === 'bold') {
        return {
          text: item.text,
          bold: true
        };
      } else if (item.type === 'numbered') {
        return {
          text: item.text,
          level: 0
        };
      } else {
        return {
          text: item.text,
          breakLine: true
        };
      }
    });

    slide.addText(content, {
      x: 0.5,
      y: y,
      w: 9,
      h: 5,
      fontSize: 14,
      color: '363636',
      fontFace: '微软雅黑',
      lineSpacing: 24,
      align: 'left'
    });
  }

  // 保存 PPT
  await pptx.writeFile({ fileName: outputFilePath });
  console.log(`PPT 已生成: ${outputFilePath}`);
}

// 主函数
async function main() {
  const mdFilePath = path.join(__dirname, '../docs/小程序功能演示文档.md');
  const pptFilePath = path.join(__dirname, '../docs/博物馆小程序功能演示.pptx');

  console.log('正在转换 Markdown 到 PPT...');

  // 读取 Markdown
  const markdown = readMarkdownFile(mdFilePath);
  console.log('Markdown 已读取');

  // 转换为 PPT 内容
  const slides = markdownToPpt(markdown);
  console.log(`已生成 ${slides.length} 张幻灯片`);

  // 创建 PPT
  await createPPT(slides, pptFilePath);
}

main().catch(console.error);