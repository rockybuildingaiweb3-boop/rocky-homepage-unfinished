import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const USER_DATA = path.join(os.tmpdir(), `brave-exact80-test-${Date.now()}`);

const brave = spawn(BRAVE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9231',
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
    const pagesRes = await fetch('http://localhost:9231/json');
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

    // Verify exactly 80 skills
    const skillsReport = await send('Runtime.evaluate', {
      expression: `(() => {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return { error: 'No #skills element' };

        // Find all skill buttons (buttons with title containing category)
        const buttons = Array.from(skillsSection.querySelectorAll('button[title*="("]'));
        const labels = buttons.map(b => b.getAttribute('aria-label'));
        
        // Check specific technologies
        const hasOpenAI = labels.includes('OpenAI');
        const hasChatGPT = labels.includes('ChatGPT');
        const hasPython = labels.includes('Python');
        const hasThree = labels.includes('Three.js');
        const hasSolidity = labels.includes('Solidity');
        const hasRust = labels.includes('Rust');
        const hasGo = labels.includes('Go / Golang');
        const hasRAG = labels.includes('RAG & Vector Search');
        const hasAgentic = labels.includes('AI Agents');

        // Check image src
        const imgs = buttons.map(b => {
          const img = b.querySelector('img');
          return img ? img.src : null;
        });
        const missingImgs = imgs.filter(src => !src);

        return {
          totalSkillsCount: buttons.length,
          hasOpenAI,
          hasChatGPT,
          hasPython,
          hasThree,
          hasSolidity,
          hasRust,
          hasGo,
          hasRAG,
          hasAgentic,
          missingImgsCount: missingImgs.length,
          first5Labels: labels.slice(0, 5),
          last5Labels: labels.slice(-5)
        };
      })()`,
      returnByValue: true
    });

    console.log('SKILLS 80 VERIFICATION REPORT:');
    console.log(JSON.stringify(skillsReport?.result?.value, null, 2));

    // Test AI Category Filter
    console.log('Testing Category Filter: "ai"...');
    const aiFilterTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const aiBtn = Array.from(document.querySelectorAll('#skills nav[aria-label="Constellation Legend"] button')).find(b => b.textContent.trim() === 'ai');
        if (!aiBtn) return { error: 'No AI filter button' };
        aiBtn.click();
        return { clicked: true };
      })()`,
      returnByValue: true
    });
    await sleep(1000);

    const afterFilterReport = await send('Runtime.evaluate', {
      expression: `(() => {
        const rows = Array.from(document.querySelectorAll('#skills .w-full.flex.flex-wrap.items-center.justify-center'));
        const rowStates = rows.map((r, i) => ({
          row: i + 1,
          isFiltered: r.classList.contains('opacity-15') || r.classList.contains('pointer-events-none')
        }));
        const telemetry = document.querySelector('#skills .min-h-8')?.textContent?.trim() || '';
        return {
          rowStates,
          telemetry
        };
      })()`,
      returnByValue: true
    });
    console.log('AI FILTER RESULTS:', JSON.stringify(afterFilterReport?.result?.value, null, 2));

    // Reset to 'all' filter
    await send('Runtime.evaluate', {
      expression: `(() => {
        const allBtn = Array.from(document.querySelectorAll('#skills nav[aria-label="Constellation Legend"] button')).find(b => b.textContent.trim() === 'all');
        if (allBtn) allBtn.click();
      })()`
    });
    await sleep(1000);

    // Capture visual artifact screenshot
    const screenshot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    const screenshotPath = 'scripts/skills-80-verified.jpg';
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
