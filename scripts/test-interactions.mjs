import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const USER_DATA = path.join(os.tmpdir(), `brave-interaction-test-${Date.now()}`);

const brave = spawn(BRAVE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9226',
  `--user-data-dir=${USER_DATA}`,
  '--window-size=1280,800',
  '--disable-gpu',
  '--no-sandbox',
  'about:blank'
], { stdio: 'ignore' });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await sleep(2000);
  const pagesRes = await fetch('http://localhost:9226/json');
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: 'http://localhost:3000/' });

  console.log('Waiting for portfolio to mount at 1280x800...');
  for (let i = 0; i < 30; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const skipBtn = document.querySelector('button[aria-label="Skip introductory ceremony"]');
        if (skipBtn) skipBtn.click();
        const cards = document.querySelectorAll('.list-item').length;
        const desktopAudio = document.querySelector('ul.hidden.md\\\\:flex button[aria-label*="music" i]');
        return { cards, hasDesktopAudio: Boolean(desktopAudio) };
      })()`,
      returnByValue: true
    });
    const val = check.result?.result?.value;
    if (val && val.cards > 0 && val.hasDesktopAudio) {
      console.log('Portfolio mounted in desktop mode:', val);
      break;
    }
    await sleep(400);
  }

  await sleep(1000);

  // 1. Hit test desktop audio toggle
  const audioHitTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('ul.hidden.md\\\\:flex button[aria-label*="music" i]');
      if (!btn) return { found: false };
      const r = btn.getBoundingClientRect();
      const midX = Math.round(r.left + r.width / 2);
      const midY = Math.round(r.top + r.height / 2);
      const hit = document.elementFromPoint(midX, midY);
      return {
        found: true,
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        hitTag: hit ? hit.tagName : null,
        isSelfOrDescendant: hit ? (btn === hit || btn.contains(hit)) : false,
      };
    })()`,
    returnByValue: true
  });
  console.log('DESKTOP AUDIO HIT TEST:', audioHitTest.result.result.value);

  // 2. Test Studio Project click -> Expand details
  console.log('Testing Studio Card click activation...');
  const cardClickTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.list-item');
      if (!card) return { success: false, error: 'No card' };
      // Scroll to work section
      document.getElementById('work').scrollIntoView({ behavior: 'instant' });
      // Trigger card click
      card.click();
      return { clicked: true };
    })()`,
    returnByValue: true
  });
  await sleep(600);

  const detailsOpenTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const details = document.querySelector('.details-container');
      const title = details?.querySelector('.title')?.textContent;
      const closeBtn = details?.querySelector('.close-button');
      return {
        hasDetails: Boolean(details),
        title,
        hasCloseButton: Boolean(closeBtn),
      };
    })()`,
    returnByValue: true
  });
  console.log('DETAILS EXPANSION TEST:', detailsOpenTest.result.result.value);

  // 3. Test Escape key to close active project
  console.log('Testing Escape key to close active project...');
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
  await sleep(500);

  const detailsClosedTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const details = document.querySelector('.details-container');
      return {
        hasDetails: Boolean(details),
      };
    })()`,
    returnByValue: true
  });
  console.log('DETAILS AFTER ESCAPE TEST:', detailsClosedTest.result.result.value);

  // 4. Test Studio Module Tab Switching
  console.log('Testing Studio Module Tab Switching (Experiments, Essays, Projects)...');
  const moduleSwitchTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('nav[aria-label="Studio Module Selector"] button'));
      const expBtn = buttons.find(b => b.textContent.includes('Experiments'));
      if (expBtn) expBtn.click();
      return {
        clickedExperiments: Boolean(expBtn),
      };
    })()`,
    returnByValue: true
  });
  await sleep(500);

  const expViewTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const h2 = document.querySelector('.studio-section h2');
      const hash = window.location.hash;
      const teasers = document.querySelectorAll('.studio-section .grid > div').length;
      return {
        hash,
        sectionH2: h2 ? h2.textContent : null,
        teasersCount: teasers,
      };
    })()`,
    returnByValue: true
  });
  console.log('EXPERIMENTS MODULE VIEW TEST:', expViewTest.result.result.value);

  // Switch back to Projects
  await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('nav[aria-label="Studio Module Selector"] button'));
      const projBtn = buttons.find(b => b.textContent.includes('Projects'));
      if (projBtn) projBtn.click();
    })()`,
  });
  await sleep(500);

  const backToProjectsTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.list-item').length;
      const hash = window.location.hash;
      return { cards, hash };
    })()`,
    returnByValue: true
  });
  console.log('BACK TO PROJECTS TEST:', backToProjectsTest.result.result.value);

  ws.close();
  brave.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  brave.kill();
  process.exit(1);
});
