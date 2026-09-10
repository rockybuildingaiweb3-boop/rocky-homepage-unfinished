import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const USER_DATA = path.join(os.tmpdir(), `brave-hit-test-${Date.now()}`);

const brave = spawn(BRAVE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9225',
  `--user-data-dir=${USER_DATA}`,
  '--disable-gpu',
  '--no-sandbox',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await sleep(2000);
  const pagesRes = await fetch('http://localhost:9225/json');
  const pages = await pagesRes.json();
  const page = pages.find(p => p.type === 'page') || pages[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data);
      callbacks.delete(data.id);
    }
  };

  await new Promise(r => { ws.onopen = r; });

  await send('Page.enable');
  await send('Runtime.enable');

  // Pre-seed sessionStorage so ceremony does not block testing
  await send('Page.navigate', { url: 'http://localhost:3000/' });

  // Fast skip ceremony if present
  console.log('Waiting for portfolio to mount...');
  for (let i = 0; i < 30; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const skipBtn = document.querySelector('button[aria-label="Skip introductory ceremony"]');
        if (skipBtn) skipBtn.click();
        const cards = document.querySelectorAll('.list-item').length;
        const footerLinks = document.querySelectorAll('#contact a').length;
        return { cards, footerLinks };
      })()`,
      returnByValue: true
    });
    const val = check.result?.result?.value;
    if (val && val.cards > 0 && val.footerLinks > 0) {
      console.log('Portfolio mounted with:', val);
      break;
    }
    await sleep(400);
  }

  await sleep(1000);

  // Now execute comprehensive hit tests
  const testResults = await send('Runtime.evaluate', {
    expression: `(() => {
      const describe = (el) => {
        if (!el) return null;
        const style = window.getComputedStyle(el);
        return {
          tagName: el.tagName,
          id: el.id,
          className: String(el.className || '').slice(0, 100),
          pointerEvents: style.pointerEvents,
          zIndex: style.zIndex,
          position: style.position,
        };
      };

      const hitTestEl = (el) => {
        if (!el) return { found: false };
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        const r = el.getBoundingClientRect();
        const midX = Math.round(r.left + r.width / 2);
        const midY = Math.round(r.top + r.height / 2);
        const topHit = document.elementFromPoint(midX, midY);
        const isSelfOrDescendant = topHit ? (el === topHit || el.contains(topHit)) : false;
        return {
          found: true,
          point: { midX, midY },
          rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
          topHit: describe(topHit),
          isSelfOrDescendant,
        };
      };

      // 1. Navbar elements
      const navLinks = Array.from(document.querySelectorAll('nav a, nav button')).map(el => ({
        label: el.textContent.trim(),
        ...hitTestEl(el)
      }));

      // 2. Studio cards
      const studioCards = Array.from(document.querySelectorAll('.list-item')).slice(0, 4).map((el, i) => ({
        index: i,
        title: el.querySelector('.item-title')?.textContent || 'card',
        ...hitTestEl(el)
      }));

      // 3. Studio content-wrapper
      const studioWrapper = document.querySelector('.content-wrapper');
      const studioWrapperTest = hitTestEl(studioWrapper);

      // 4. Footer links
      const footerLinks = Array.from(document.querySelectorAll('#contact a, #contact button')).slice(0, 8).map(el => ({
        text: el.textContent.trim() || el.getAttribute('aria-label') || el.className,
        href: el.getAttribute('href'),
        ...hitTestEl(el)
      }));

      // 5. Audio toggle button
      const audioBtn = document.querySelector('button[aria-label*="audio" i], button[aria-label*="music" i]');
      const audioTest = hitTestEl(audioBtn);

      return {
        navLinks,
        studioCards,
        studioWrapperTest,
        footerLinks,
        audioTest,
      };
    })()`,
    returnByValue: true
  });

  console.log('=== HIT TEST RESULTS ===');
  console.log(JSON.stringify(testResults.result.result.value, null, 2));

  ws.close();
  brave.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  brave.kill();
  process.exit(1);
});
