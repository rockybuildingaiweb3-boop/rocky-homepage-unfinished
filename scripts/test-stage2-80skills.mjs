import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const USER_DATA = path.join(os.tmpdir(), `brave-stage2-test-${Date.now()}`);

const brave = spawn(BRAVE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9233',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1440,900',
  '--disable-gpu',
  '--no-sandbox',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  try {
    await sleep(2500);
    const pagesRes = await fetch('http://localhost:9233/json');
    const pages = await pagesRes.json();
    const page = pages.find(p => p.type === 'page') || pages[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        callbacks.set(msgId, (data) => resolve(data.result));
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const cb = callbacks.get(data.id);
        callbacks.delete(data.id);
        cb(data);
      }
    };

    await new Promise(r => { ws.onopen = r; });

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Navigating to http://localhost:3000/ ...');
    await send('Page.navigate', { url: 'http://localhost:3000/' });

    // Skip ceremony
    for (let i = 0; i < 30; i++) {
      const check = await send('Runtime.evaluate', {
        expression: `(() => {
          const skip = document.querySelector('button[aria-label="Skip introductory ceremony"]');
          if (skip) skip.click();
          const hasSkills = Boolean(document.getElementById('skills'));
          return { hasSkills };
        })()`,
        returnByValue: true
      });
      if (check?.result?.value?.hasSkills) {
        console.log('Ceremony skipped, homepage mounted.');
        break;
      }
      await sleep(300);
    }

    await sleep(1000);

    // Scroll to skills section
    await send('Runtime.evaluate', {
      expression: `
        const s = document.getElementById('skills');
        if (s) s.scrollIntoView({ behavior: 'instant' });
      `
    });
    await sleep(1500);

    // Verify 8 rows of 10 items
    const skillsReport = await send('Runtime.evaluate', {
      expression: `(() => {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return { error: 'No #skills element' };

        const buttons = Array.from(skillsSection.querySelectorAll('button[title*="("]'));
        const labels = buttons.map(b => b.getAttribute('aria-label'));

        // Check required specific names from prompt
        const checkNames = [
          'TypeScript', 'React', 'HTML5/Semantics', 'Three.js', 'React Three Fiber', 'Draco/Meshopt', 'Canvas API',
          'FastAPI', 'tRPC', 'Drizzle ORM', 'viem', 'wagmi', 'Foundry', 'Privy', 'ERC-4337', 'SIWE',
          'OpenAI API', 'Anthropic Claude', 'Google Gemini', 'DeepSeek', '通义千问', 'Vercel AI SDK', 'Function Calling', 'Structured Output', 'Prompt Engineering', 'LangSmith',
          'LangChain', 'LangGraph', 'LlamaIndex', 'CrewAI', 'AutoGen', 'Dify', 'Coze', 'Semantic Kernel', 'MCP', 'Agent Memory (Mem0)',
          'pgvector', 'Chroma', 'Milvus', 'Weaviate', 'Qdrant', 'LlamaParse', 'Unstructured', 'Reranker', 'Embedding Models', '引用溯源',
          'Docker', 'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana', 'Sentry', 'Pytest', 'Playwright', 'Celery / BullMQ', 'OpenTelemetry'
        ];

        const missing = checkNames.filter(name => !labels.includes(name));

        // Group into rows
        const rows = Array.from(skillsSection.querySelectorAll('.w-full.flex.flex-wrap.items-center.justify-center'));
        const rowCounts = rows.map(r => r.querySelectorAll('button[title*="("]').length);

        // Check category legends
        const legendButtons = Array.from(skillsSection.querySelectorAll('nav[aria-label="Constellation Legend"] button')).map(b => b.textContent.trim());

        return {
          totalSkillsCount: buttons.length,
          allRequiredNamesPresent: missing.length === 0,
          missingNames: missing,
          rowCount: rows.length,
          rowCounts,
          legendButtonsCount: legendButtons.length,
          legendButtons
        };
      })()`,
      returnByValue: true
    });

    console.log('STAGE 2 SKILLS REPORT:');
    console.log(JSON.stringify(skillsReport?.result?.value, null, 2));

    // Test category filter click on 'models' (row 5)
    console.log('Testing category filter: "models"...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('#skills nav[aria-label="Constellation Legend"] button')).find(b => b.textContent.trim() === 'models');
        if (btn) btn.click();
      })()`
    });
    await sleep(800);

    const filterCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const rows = Array.from(document.querySelectorAll('#skills .w-full.flex.flex-wrap.items-center.justify-center'));
        return rows.map((r, i) => ({
          row: i + 1,
          isFiltered: r.classList.contains('opacity-15')
        }));
      })()`,
      returnByValue: true
    });
    console.log('Filter on "models" (row 5 should be active):', JSON.stringify(filterCheck?.result?.value, null, 2));

    // Reset to 'all'
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('#skills nav[aria-label="Constellation Legend"] button')).find(b => b.textContent.trim() === 'all');
        if (btn) btn.click();
      })()`
    });
    await sleep(800);

    // Check marquee
    const marqueeCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const forwardQuotes = document.querySelectorAll('.marquee-track-forward .marquee-quote-item');
        const reverseQuotes = document.querySelectorAll('.marquee-track-reverse .marquee-quote-item');
        return {
          track1Count: forwardQuotes.length,
          track2Count: reverseQuotes.length
        };
      })()`,
      returnByValue: true
    });
    console.log('Marquee Track Counts:', JSON.stringify(marqueeCheck?.result?.value, null, 2));

    // Capture screenshot
    const screenshot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    const screenshotPath = 'scripts/skills-stage2-verified.jpg';
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Saved screenshot to ${screenshotPath}`);

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    brave.kill('SIGTERM');
  }
}

run();
