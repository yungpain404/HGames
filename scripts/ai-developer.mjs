import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const REPO_ROOT = process.cwd();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('::error::OPENAI_API_KEY chưa được cấu hình trong GitHub Secrets.');
  process.exit(1);
}

function readFileSafe(rel) {
  try {
    return fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
  } catch {
    return null;
  }
}

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: 'pipe', ...opts });
}

// Thu thập ngữ cảnh repository
const contextFiles = [
  'AGENTS.md',
  '.github/ai/developer-prompt.md',
  '.github/ai/quality-rules.md',
  'TODO.md',
  'README.md',
  'package.json',
  'index.html',
  'css/style.css',
  'js/main.js',
  'test/main.test.js',
];

let context = '';
for (const f of contextFiles) {
  const content = readFileSafe(f);
  if (content) {
    context += `\n### FILE: ${f}\n\`\`\`\n${content}\n\`\`\`\n`;
  }
}

const developerPrompt = readFileSafe('.github/ai/developer-prompt.md') || '';

const prompt = `Bạn là AI Senior Developer đóng vai trò tự động cải thiện kho HGames (HTML/CSS/vanilla JS).

${developerPrompt}

NGỮ CẢNH REPOSITORY (tất cả file liên quan):
${context}

YÊU CẦU:
- Phân tích repository, chọn TỐI ĐA MỘT nhiệm vụ thực sự có giá trị (điểm ≥ 80 theo thang điểm trong developer-prompt.md).
- Nếu không có nhiệm vụ phù hợp, trả lời patch là "none".
- Triển khai thay đổi tối thiểu, chỉ sửa file cần thiết.
- Không tạo commit giả, không sửa bản chất kiến trúc, không thêm dependency không cần thiết.
- Sau khi sửa, chạy npm test và npm run lint (giả định trong báo cáo).
- Trả lời KHÔNG DẤU NGẶT theo định dạng dưới đây:

===REPORT===
<báo cáo phát triển bằng markdown, tiếng Việt>
===PATCH===
<unified diff patch có thể áp dụng bằng git apply, hoặc "none">
===END===
`;

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  }),
});

if (!response.ok) {
  const text = await response.text();
  console.error(`::error::Lỗi OpenAI API: ${response.status} ${text}`);
  process.exit(1);
}

const data = await response.json();
const content = data.choices?.[0]?.message?.content || '';

let report = 'Không có báo cáo từ AI.';
let patch = 'none';

const reportMatch = content.match(/===REPORT===\n([\s\S]*?)===PATCH===/);
if (reportMatch) report = reportMatch[1].trim();

const patchMatch = content.match(/===PATCH===\n([\s\S]*?)===END===/);
if (patchMatch) patch = patchMatch[1].trim();

const githubOutput = process.env.GITHUB_OUTPUT;
if (!githubOutput) {
  console.error('::error::Chỉ chạy được trong GitHub Actions.');
  process.exit(1);
}

let hasChanges = 'false';

if (patch && patch !== 'none' && patch.length > 0) {
  fs.writeFileSync('patch.diff', patch, 'utf8');

  // Kiểm tra patch có áp dụng sạch không
  try {
    sh('git', ['apply', '--check', 'patch.diff']);
    hasChanges = 'true';
  } catch (err) {
    console.warn(`::warning::Patch không áp dụng được sạch sẽ: ${err.message}`);
    hasChanges = 'false';
  }
}

const fsOut = fs.createWriteStream(githubOutput, { flags: 'a' });
fsOut.write(`report<<EOF\n${report}\nEOF\n`);
fsOut.write(`patch<<EOF\n${patch}\nEOF\n`);
fsOut.write(`has_changes=${hasChanges}\n`);
fsOut.end();

console.log(`::notice::Hoàn tất chạy AI. has_changes=${hasChanges}`);
