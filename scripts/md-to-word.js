const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

// 读取 Markdown 文件
function readMarkdownFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// 解析 Markdown 到文档内容
function markdownToDocx(markdown) {
  const lines = markdown.split('\n');
  const children = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const level = getMarkdownLevel(line);

    // 处理标题
    if (level > 0) {
      const title = getMarkdownTitle(line);
      const fontSize = 22 - level * 2;
      children.push(new Paragraph({
        children: [new TextRun({
          text: title,
          bold: true,
          size: fontSize * 20
        })],
        heading: HeadingLevel[level],
        spacing: { after: 200 }
      }));
    }
    // 处理分隔线
    else if (line === '---') {
      children.push(new Paragraph({
        text: '',
        border: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'D9D9D9' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D9D9D9' }
        },
        spacing: { before: 200, after: 200 }
      }));
    }
    // 处理列表项
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.substring(2);
      children.push(new Paragraph({
        bullet: { char: '•', level: 0 },
        text: text,
        spacing: { after: 100 }
      }));
    }
    // 处理有序列表
    else if (line.match(/^\d+\. /)) {
      const match = line.match(/(\d+)\.\s(.*)/);
      if (match) {
        const num = match[1];
        const text = match[2];
        children.push(new Paragraph({
          text: `${num}. ${text}`,
          spacing: { after: 100 }
        }));
      }
    }
    // 处理表格
    else if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines = [];
      for (let j = i; j < lines.length; j++) {
        const tableLine = lines[j].trim();
        if (tableLine.startsWith('|') && tableLine.endsWith('|')) {
          tableLines.push(tableLine);
          i = j;
          break;
        }
      }

      if (tableLines.length > 1) {
        const rows = tableLines.slice(1, -1).map(line => {
          const cells = line.split('|').map(cell => cell.trim());
          return cells;
        });

        if (rows.length > 0) {
          const table = createTable(rows);
          children.push(table);
        }
      }
    }
    // 处理加粗文本
    else if (line.startsWith('**') && line.endsWith('**')) {
      const text = line.substring(2, line.length - 2);
      children.push(new Paragraph({
        children: [new TextRun({
          text: text,
          bold: true
        })],
        spacing: { after: 100 }
      }));
    }
    // 普通文本
    else if (line) {
      children.push(new Paragraph({
        text: line,
        spacing: { after: 100 }
      }));
    }
  }

  return children;
}

// 创建表格
function createTable(rows) {
  const tableRows = rows.map(rowData => {
    const cells = rowData.map(cellText => {
      const align = cellText.includes('┌') || cellText.includes('│') || cellText.includes('└') ||
                     cellText.includes('─') || cellText.includes('┬') || cellText.includes('┼') ||
                     cellText.includes('┴') ? AlignmentType.CENTER : AlignmentType.LEFT;

      return new TableCell({
        children: [
          new Paragraph({
            text: cellText,
            alignment: align,
            spacing: { after: 100, before: 100 }
          })
        ],
        width: {
          size: 100 / rowData.length,
          type: WidthType.PERCENTAGE
        }
      });
    });

    return new TableRow({
      children: cells
    });
  });

  const table = new Table({
    rows: tableRows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    }
  });

  return table;
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

// 创建 Word 文档
async function createWord(children, outputFilePath) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputFilePath, buffer);
  console.log(`Word 文档已生成: ${outputFilePath}`);
}

// 主函数
async function main() {
  const mdFilePath = path.join(__dirname, '../docs/小程序功能演示文档.md');
  const docxFilePath = path.join(__dirname, '../docs/博物馆小程序功能演示.docx');

  console.log('正在转换 Markdown 到 Word...');

  // 读取 Markdown
  const markdown = readMarkdownFile(mdFilePath);
  console.log('Markdown 已读取');

  // 转换为文档内容
  const children = markdownToDocx(markdown);
  console.log(`已生成 ${children.length} 个段落`);

  // 创建 Word 文档
  await createWord(children, docxFilePath);
}

main().catch(console.error);