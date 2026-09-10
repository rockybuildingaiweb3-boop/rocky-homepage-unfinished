import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const USER_DATA = path.join(os.tmpdir(), `brave-phase2-test-${Date.now()}`);

const brave = spawn(BRAVE_PATH, [
  '--headless=new',
  '--remote-debugging-port=9227',
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
  const pagesRes = await fetch('http://localhost:9227/json');
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

  console.log('1. Navigating to http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });

  // Fast skip intro
  for (let i = 0; i < 30; i++) {
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const skip = document.querySelector('button[aria-label="Skip introductory ceremony"]');
        if (skip) skip.click();
        const hasOpenAI = Boolean(document.querySelector('button[aria-label="OpenAI"]'));
        const hasChatGPT = Boolean(document.querySelector('button[aria-label="ChatGPT"]'));
        return { hasOpenAI, hasChatGPT };
      })()`,
      returnByValue: true
    });
    if (check.result?.result?.value?.hasOpenAI) {
      console.log('Homepage mounted with OpenAI and ChatGPT skills:', check.result.result.value);
      break;
    }
    await sleep(400);
  }

  await sleep(1000);

  // 1. Test Skills: OpenAI and ChatGPT presence & selection
  console.log('Testing Skills Row 5 (OpenAI, ChatGPT, selection)...');
  const skillsTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const openAiBtn = document.querySelector('button[aria-label="OpenAI"]');
      const chatGptBtn = document.querySelector('button[aria-label="ChatGPT"]');
      const row5Count = document.querySelectorAll('button[aria-label="OpenAI"], button[aria-label="ChatGPT"], button[aria-label="Anthropic Claude"], button[aria-label="LangChain"], button[aria-label="Agentic AI"], button[aria-label="RAG & Vector Search"]').length;
      
      // Select OpenAI
      if (openAiBtn) openAiBtn.click();
      
      return {
        hasOpenAI: Boolean(openAiBtn),
        hasChatGPT: Boolean(chatGptBtn),
        row5Count,
      };
    })()`,
    returnByValue: true
  });
  console.log('SKILLS TEST:', skillsTest.result.result.value);

  // 2. Test Gateway CTA: "enter the studio" -> /studio/projects
  console.log('Testing Hero CTA -> Studio navigation...');
  const ctaTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const cta = document.querySelector('button[aria-label="Enter the Studio projects"]');
      if (cta) cta.click();
      return { clickedCTA: Boolean(cta) };
    })()`,
    returnByValue: true
  });
  await sleep(600);

  const studioRouteTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const pathname = window.location.pathname;
      const hasStudioShell = Boolean(document.querySelector('nav[aria-label="Studio Navigation"]'));
      const activeTab = document.querySelector('nav[aria-label="Studio Navigation"] a[aria-current="page"]')?.textContent;
      const cardCount = document.querySelectorAll('.list-item').length;
      return {
        pathname,
        hasStudioShell,
        activeTab: activeTab?.trim(),
        cardCount,
      };
    })()`,
    returnByValue: true
  });
  console.log('STUDIO PROJECTS ROUTE TEST:', studioRouteTest.result.result.value);

  // 3. Test Studio Sub-route: Click "Essays" -> /studio/blog
  console.log('Testing Studio Blog Route (/studio/blog)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const blogLink = Array.from(document.querySelectorAll('nav[aria-label="Studio Navigation"] a')).find(a => a.textContent.includes('Essays'));
      if (blogLink) blogLink.click();
    })()`,
  });
  await sleep(600);

  const blogRouteTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const pathname = window.location.pathname;
      const articles = document.querySelectorAll('article').length;
      const firstTitle = document.querySelector('article h3')?.textContent;
      
      // Click first essay to open modal reader
      const firstArticle = document.querySelector('article');
      if (firstArticle) firstArticle.click();
      
      return {
        pathname,
        articlesCount: articles,
        firstTitle,
      };
    })()`,
    returnByValue: true
  });
  console.log('STUDIO BLOG ROUTE TEST:', blogRouteTest.result.result.value);

  await sleep(400);

  // 4. Test Essay Modal and Escape Key dismissal
  const modalOpenedTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const modal = document.querySelector('div[role="dialog"]');
      return {
        hasReaderModal: Boolean(modal),
        modalTitle: modal?.querySelector('h2')?.textContent,
      };
    })()`,
    returnByValue: true
  });
  console.log('ESSAY MODAL OPENED:', modalOpenedTest.result.result.value);

  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
  await sleep(400);

  const modalClosedTest = await send('Runtime.evaluate', {
    expression: `(() => {
      return { hasReaderModal: Boolean(document.querySelector('div[role="dialog"]')) };
    })()`,
    returnByValue: true
  });
  console.log('ESSAY MODAL CLOSED AFTER ESCAPE:', modalClosedTest.result.result.value);

  // 5. Test Studio Career Route: Click "Career" -> /studio/career
  console.log('Testing Studio Career Route (/studio/career)...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const careerLink = Array.from(document.querySelectorAll('nav[aria-label="Studio Navigation"] a')).find(a => a.textContent.includes('Career'));
      if (careerLink) careerLink.click();
    })()`,
  });
  await sleep(600);

  const careerRouteTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const pathname = window.location.pathname;
      const h2 = document.querySelector('h2')?.textContent;
      const timelineNodes = document.querySelectorAll('.space-y-10 > .relative').length;
      return {
        pathname,
        h2,
        timelineNodes,
      };
    })()`,
    returnByValue: true
  });
  console.log('STUDIO CAREER ROUTE TEST:', careerRouteTest.result.result.value);

  // 6. Test Direct URL load & refresh on /studio/blog
  console.log('Testing direct URL load on http://localhost:3000/studio/blog ...');
  await send('Page.navigate', { url: 'http://localhost:3000/studio/blog' });
  await sleep(1500);

  const directUrlTest = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        pathname: window.location.pathname,
        articlesCount: document.querySelectorAll('article').length,
        hasStudioShell: Boolean(document.querySelector('nav[aria-label="Studio Navigation"]')),
      };
    })()`,
    returnByValue: true
  });
  console.log('DIRECT URL LOAD ON /studio/blog TEST:', directUrlTest.result.result.value);

  // 7. Test Return Gateway to Exhibition: Click "return to exhibition"
  console.log('Testing return gateway to homepage...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const returnBtn = document.querySelector('header button');
      if (returnBtn) returnBtn.click();
    })()`,
  });
  await sleep(800);

  const returnHomeTest = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        pathname: window.location.pathname,
        hasHomeNavbar: Boolean(document.querySelector('nav ul.hidden.md\\\\:flex')),
        hasSkillsSection: Boolean(document.getElementById('skills')),
        hasFooterSignature: Boolean(document.querySelector('svg#signature')),
      };
    })()`,
    returnByValue: true
  });
  console.log('RETURN TO EXHIBITION TEST:', returnHomeTest.result.result.value);

  ws.close();
  brave.kill();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  brave.kill();
  process.exit(1);
});
