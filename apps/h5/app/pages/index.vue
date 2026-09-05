<script setup lang="ts">
const config = useRuntimeConfig()
const webAdminUrl = config.public.webAdminUrl

useSeoMeta({
  title: 'Visual Editor Pro｜可视化低代码平台',
  description: 'Visual Editor Pro 让运营、设计与开发团队以拖拽组件、配置样式和绑定数据的方式构建 H5 页面与应用。',
})

const capabilities = [
  { code: '01', icon: '◇', title: '可视化搭建', text: '从组件面板拖拽内容到画布，把页面结构从想法变成可编辑的界面。' },
  { code: '02', icon: '✦', title: '组件与主题配置', text: '调整组件属性、样式与主题，让每一页保持一致的品牌表达。' },
  { code: '03', icon: '▣', title: '多页面应用管理', text: '在一个应用中组织多个页面，清晰管理页面结构与访问入口。' },
  { code: '04', icon: '◒', title: '商品与文章内容', text: '集中管理商品、文章和分类内容，为展示页面准备可复用素材。' },
  { code: '05', icon: '⌁', title: '数据源绑定', text: '把页面组件连接到业务数据，让内容在运行时按需呈现。' },
  {
    code: '06',
    icon: '↗',
    title: '预览、发布与回滚',
    text: '在发布前验证页面效果，保留发布版本，并在需要时快速回退。',
  },
]

const steps = [
  { number: '01', title: '创建应用', text: '建立应用空间，规划页面与内容。' },
  { number: '02', title: '拖拽搭建', text: '从组件库组合出页面的视觉结构。' },
  { number: '03', title: '配置内容与数据', text: '编辑样式、属性，并绑定业务数据。' },
  { number: '04', title: '预览发布', text: '确认效果后发布，同时保留版本记录。' },
]

const scenarios = [
  { type: 'BRAND', title: '品牌展示', text: '用沉浸式页面讲清品牌故事、服务与价值主张。' },
  { type: 'CAMPAIGN', title: '营销活动', text: '快速配置专题活动页，承接每一次营销创意。' },
  { type: 'COMMERCE', title: '商品展示', text: '连接商品内容，组合更清晰的产品浏览体验。' },
  { type: 'CONTENT', title: '内容资讯', text: '将文章与分类组织为易读、可持续更新的内容页面。' },
]

const faqs = [
  {
    question: '什么是可视化低代码？',
    answer:
      '它将常见页面能力封装成可配置组件。你可以通过拖拽、设置属性与绑定数据完成页面搭建，把精力放在内容与体验上。',
  },
  {
    question: 'H5 页面与后台是什么关系？',
    answer: 'H5 是用户访问的运行端；Web 后台用于创建应用、编辑页面、管理内容与发布版本，两端共同组成完整工作流。',
  },
  {
    question: '页面如何发布和管理版本？',
    answer: '后台支持预览、发布与发布版本查看。页面更新后可保留发布记录，在需要时回滚到已有版本。',
  },
]
</script>

<template>
  <main class="landing-page">
    <div aria-hidden="true" class="grid-field"></div>
    <div aria-hidden="true" class="orb orb-cyan"></div>
    <div aria-hidden="true" class="orb orb-magenta"></div>

    <header class="site-header shell">
      <NuxtLink to="/" class="brand" aria-label="Visual Editor Pro 首页">
        <span class="brand-mark">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span>
          VISUAL
          <span>_</span>
          EDITOR
        </span>
      </NuxtLink>
      <nav aria-label="首页导航" class="nav-links">
        <a href="#capabilities">平台能力</a>
        <a href="#workflow">搭建流程</a>
        <a href="#scenarios">应用场景</a>
      </nav>
      <a :href="webAdminUrl" class="button button-small">
        开启你的低代码
        <span>↗</span>
      </a>
    </header>

    <section class="hero shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">
          <span></span>
          VISUAL LOW-CODE PLATFORM / 01
        </p>
        <h1 id="hero-title">
          让想象，
          <em>即刻成形</em>
        </h1>
        <p class="hero-description">
          Visual Editor Pro 是一个可视化低代码平台。拖拽组件、配置样式、绑定数据，把每一个 H5
          页面与应用构想，变成可发布的真实体验。
        </p>
        <div class="hero-actions">
          <a class="button" :href="webAdminUrl">
            开启你的低代码
            <span>↗</span>
          </a>
          <a class="text-link" href="#capabilities">
            探索平台能力
            <span>↓</span>
          </a>
        </div>
        <div class="hero-meta">
          <span>
            <b>DRAG</b>
            拖拽构建
          </span>
          <span>
            <b>STYLE</b>
            自由配置
          </span>
          <span>
            <b>DATA</b>
            内容连接
          </span>
        </div>
      </div>

      <div class="editor-demo" aria-label="可视化编辑器界面示意">
        <div class="demo-caption">
          INTERFACE DEMO
          <span>界面示意</span>
        </div>
        <div class="demo-window">
          <div class="demo-topbar">
            <span class="signal"></span>
            <span>Untitled project</span>
            <div>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>
          <div class="demo-body">
            <aside class="demo-palette">
              <p>BLOCKS</p>
              <div class="palette-unit active">T</div>
              <div class="palette-unit">▣</div>
              <div class="palette-unit">◎</div>
              <div class="palette-unit">↗</div>
            </aside>
            <div class="demo-canvas">
              <span class="canvas-label">CANVAS / 1440</span>
              <div class="canvas-page">
                <div class="canvas-nav"></div>
                <div class="canvas-heading">
                  CREATE
                  <br />
                  <span>WITHOUT LIMITS</span>
                </div>
                <div class="canvas-line"></div>
                <div class="canvas-cards">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
              <div class="cursor">✦</div>
              <div class="drag-item">+ Visual Card</div>
            </div>
            <aside class="demo-properties">
              <p>PROPERTY</p>
              <span>LAYOUT</span>
              <div class="property-line"></div>
              <span>COLOR</span>
              <div class="property-colors">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <span>CONTENT</span>
              <div class="property-line wide"></div>
              <div class="property-line"></div>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <section id="capabilities" class="section shell">
      <div class="section-heading">
        <p class="eyebrow">
          <span></span>
          CAPABILITIES / 02
        </p>
        <h2>
          把复杂的构建过程，
          <br />
          <em>交给直觉。</em>
        </h2>
        <p>从第一块组件到一次稳定发布，每个环节都有清晰的可视化入口。</p>
      </div>
      <div class="capability-grid">
        <article v-for="item in capabilities" :key="item.code" class="capability-card">
          <span class="card-code">{{ item.code }}</span>
          <span class="capability-icon">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <span class="card-corner"></span>
        </article>
      </div>
    </section>

    <section id="workflow" class="section workflow-section">
      <div class="shell">
        <div class="workflow-top">
          <p class="eyebrow">
            <span></span>
            WORKFLOW / 03
          </p>
          <h2>
            从灵感到上线，
            <em>每一步都可见。</em>
          </h2>
        </div>
        <div class="steps">
          <article v-for="step in steps" :key="step.number" class="step">
            <span>{{ step.number }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="scenarios" class="section shell">
      <div class="section-heading">
        <p class="eyebrow">
          <span></span>
          USE CASES / 04
        </p>
        <h2>
          让每种业务表达，
          <em>都有自己的舞台。</em>
        </h2>
      </div>
      <div class="scenario-grid">
        <article
          v-for="(scenario, index) in scenarios"
          :key="scenario.type"
          class="scenario-card"
          :class="`scenario-${index + 1}`"
        >
          <span>{{ scenario.type }}</span>
          <div aria-hidden="true" class="scenario-visual">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <h3>{{ scenario.title }}</h3>
          <p>{{ scenario.text }}</p>
          <b>EXPLORE ↗</b>
        </article>
      </div>
    </section>

    <section class="faq-section">
      <div class="shell faq-layout">
        <div>
          <p class="eyebrow">
            <span></span>
            FAQ / 05
          </p>
          <h2>
            构建，不必从
            <br />
            <em>空白开始。</em>
          </h2>
          <p class="faq-intro">用可视化方式连接创意与业务，让团队以更轻盈的方式持续迭代。</p>
        </div>
        <div class="faq-list">
          <details v-for="(faq, index) in faqs" :key="faq.question" :open="index === 0">
            <summary>
              <span>0{{ index + 1 }}</span>
              {{ faq.question }}
              <b>+</b>
            </summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <section class="closing shell">
      <p class="eyebrow">
        <span></span>
        READY TO BUILD / 06
      </p>
      <h2>
        下一个好点子，
        <br />
        <em>现在就开始。</em>
      </h2>
      <a class="button" :href="webAdminUrl">
        开启你的低代码
        <span>↗</span>
      </a>
    </section>

    <footer class="footer shell">
      <NuxtLink to="/" class="brand">
        <span class="brand-mark">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span>
          VISUAL
          <span>_</span>
          EDITOR
        </span>
      </NuxtLink>
      <p>VISUAL LOW-CODE PLATFORM · BUILD WHAT YOU IMAGINE</p>
      <span>© 2026</span>
    </footer>
  </main>
</template>

<style scoped>
.landing-page {
  --ink: #e9faff;
  --muted: #91a9bc;
  --cyan: #4cf6ff;
  --magenta: #f04cff;
  --panel: rgba(9, 23, 42, 0.72);
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  color: var(--ink);
  background: #030914;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Microsoft YaHei',
    sans-serif;
}
.shell {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.grid-field {
  position: absolute;
  inset: 0 0 auto;
  height: 900px;
  background-image:
    linear-gradient(rgba(76, 246, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(76, 246, 255, 0.055) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, #000 0%, transparent 92%);
  pointer-events: none;
}
.orb {
  position: absolute;
  width: 480px;
  height: 480px;
  filter: blur(80px);
  opacity: 0.17;
  border-radius: 50%;
  pointer-events: none;
  animation: drift 14s ease-in-out infinite alternate;
}
.orb-cyan {
  top: 130px;
  left: -180px;
  background: var(--cyan);
}
.orb-magenta {
  top: 500px;
  right: -230px;
  background: var(--magenta);
  animation-delay: -7s;
}
.site-header {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(126, 202, 225, 0.16);
}
.brand {
  display: flex;
  gap: 9px;
  align-items: center;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-decoration: none;
}
.brand > span:last-child span {
  color: var(--cyan);
}
.brand-mark {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  width: 22px;
  height: 21px;
}
.brand-mark i {
  width: 5px;
  background: var(--cyan);
  transform: skewY(-25deg);
  box-shadow: 0 0 10px var(--cyan);
}
.brand-mark i:first-child {
  height: 11px;
}
.brand-mark i:nth-child(2) {
  height: 20px;
}
.brand-mark i:last-child {
  height: 15px;
}
.nav-links {
  display: flex;
  gap: 34px;
  margin-left: auto;
  margin-right: 34px;
}
.nav-links a,
.text-link {
  color: #b5c8d8;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}
.nav-links a:hover,
.text-link:hover {
  color: var(--cyan);
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 17px;
  min-height: 50px;
  padding: 0 23px;
  color: #04101b;
  background: var(--cyan);
  border: 1px solid var(--cyan);
  box-shadow:
    5px 5px 0 rgba(240, 76, 255, 0.78),
    0 0 25px rgba(76, 246, 255, 0.23);
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  font-size: 15px;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}
.button:hover {
  transform: translate(-2px, -2px);
  background: #d7feff;
  box-shadow:
    8px 8px 0 rgba(240, 76, 255, 0.82),
    0 0 35px rgba(76, 246, 255, 0.4);
}
.button span {
  font-size: 21px;
  line-height: 0;
}
.button-small {
  min-height: 40px;
  padding: 0 16px;
  font-size: 13px;
  gap: 10px;
  box-shadow: 3px 3px 0 rgba(240, 76, 255, 0.78);
}
.button-small span {
  font-size: 16px;
}
.hero {
  min-height: 655px;
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 0.9fr) minmax(460px, 1.1fr);
  gap: 56px;
  padding: 65px 0 72px;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 19px;
  color: var(--cyan);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  letter-spacing: 1.6px;
}
.eyebrow span {
  display: inline-block;
  width: 26px;
  height: 1px;
  background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan);
}
.hero h1,
.section h2,
.faq-section h2,
.closing h2 {
  margin: 0;
  color: #f5feff;
  font-size: clamp(46px, 5.4vw, 76px);
  line-height: 1.08;
  letter-spacing: -3px;
}
.hero h1 em,
.section h2 em,
.faq-section h2 em,
.closing h2 em {
  color: var(--cyan);
  font-style: normal;
  text-shadow: 0 0 26px rgba(76, 246, 255, 0.26);
}
.hero-description {
  max-width: 500px;
  margin: 28px 0;
  color: #b5c6d4;
  font-size: 17px;
  line-height: 1.85;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 30px;
}
.text-link {
  color: var(--ink);
  font-weight: 700;
}
.text-link span {
  margin-left: 8px;
  color: var(--cyan);
}
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 23px;
  margin-top: 47px;
  color: #829aaa;
  font-size: 12px;
}
.hero-meta b {
  margin-right: 5px;
  color: var(--magenta);
  font-family: ui-monospace, monospace;
  font-size: 10px;
}
.editor-demo {
  width: 100%;
  transform: perspective(1300px) rotateY(-7deg) rotateX(2deg);
  animation: floatDemo 6s ease-in-out infinite;
}
.demo-caption {
  display: flex;
  justify-content: space-between;
  margin: 0 0 9px 8px;
  color: var(--cyan);
  font:
    10px ui-monospace,
    monospace;
  letter-spacing: 1.4px;
}
.demo-caption span {
  color: #698499;
}
.demo-window {
  overflow: hidden;
  border: 1px solid rgba(76, 246, 255, 0.5);
  background: #071221;
  box-shadow:
    -16px 17px 50px rgba(0, 0, 0, 0.55),
    0 0 30px rgba(76, 246, 255, 0.13);
}
.demo-topbar {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(129, 189, 205, 0.18);
  color: #9bb4c6;
  font:
    10px ui-monospace,
    monospace;
}
.signal {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--magenta);
  box-shadow: 0 0 8px var(--magenta);
}
.demo-topbar div {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.demo-topbar i {
  width: 6px;
  height: 6px;
  background: #315268;
}
.demo-body {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) 100px;
  min-height: 326px;
}
.demo-palette,
.demo-properties {
  padding: 14px 10px;
  background: rgba(3, 11, 24, 0.8);
  border-right: 1px solid rgba(129, 189, 205, 0.14);
}
.demo-palette p,
.demo-properties p {
  margin: 0 0 15px;
  color: #6e8c9f;
  font:
    8px ui-monospace,
    monospace;
}
.palette-unit {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin: 0 auto 10px;
  color: #7591a5;
  border: 1px solid #294356;
  font-size: 13px;
}
.palette-unit.active {
  color: var(--cyan);
  border-color: var(--cyan);
  box-shadow: 0 0 10px rgba(76, 246, 255, 0.25);
}
.demo-canvas {
  position: relative;
  padding: 28px 25px;
  overflow: hidden;
  background-color: #0c1a2b;
  background-image:
    linear-gradient(rgba(93, 144, 167, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(93, 144, 167, 0.08) 1px, transparent 1px);
  background-size: 16px 16px;
}
.canvas-label {
  position: absolute;
  top: 9px;
  left: 12px;
  color: #69879a;
  font:
    8px ui-monospace,
    monospace;
}
.canvas-page {
  height: 255px;
  padding: 20px;
  background: #effeff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.24);
}
.canvas-nav {
  width: 52%;
  height: 6px;
  margin-bottom: 31px;
  background: #071625;
}
.canvas-heading {
  color: #0a1d30;
  font:
    700 23px/1 ui-monospace,
    monospace;
}
.canvas-heading span {
  color: #0e899e;
}
.canvas-line {
  width: 70%;
  height: 4px;
  margin-top: 17px;
  background: #b6d4d8;
}
.canvas-cards {
  display: flex;
  gap: 7px;
  margin-top: 34px;
}
.canvas-cards i {
  flex: 1;
  height: 55px;
  background: #d9eef0;
}
.canvas-cards i:first-child {
  background: #16384b;
}
.cursor {
  position: absolute;
  top: 101px;
  right: 31%;
  color: var(--magenta);
  font-size: 24px;
  filter: drop-shadow(0 0 5px var(--magenta));
}
.drag-item {
  position: absolute;
  right: 15px;
  bottom: 30px;
  padding: 7px 10px;
  color: var(--cyan);
  border: 1px solid var(--cyan);
  background: #0b2334;
  font:
    9px ui-monospace,
    monospace;
}
.demo-properties {
  border-right: 0;
  border-left: 1px solid rgba(129, 189, 205, 0.14);
}
.demo-properties > span {
  display: block;
  margin: 11px 0 6px;
  color: #88a5b7;
  font:
    8px ui-monospace,
    monospace;
}
.property-line {
  height: 6px;
  background: #29485d;
}
.property-line.wide {
  width: 93%;
}
.property-colors {
  display: flex;
  gap: 4px;
}
.property-colors i {
  width: 12px;
  height: 12px;
  background: var(--cyan);
}
.property-colors i:nth-child(2) {
  background: var(--magenta);
}
.property-colors i:last-child {
  background: #e6eff1;
}
.section {
  padding: 112px 0;
}
.section-heading {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 45px;
  align-items: end;
  margin-bottom: 51px;
}
.section-heading .eyebrow {
  grid-column: 1/-1;
  margin-bottom: 0;
}
.section h2,
.faq-section h2,
.closing h2 {
  font-size: clamp(37px, 4.2vw, 58px);
}
.section-heading > p:last-child {
  max-width: 390px;
  margin: 0;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.8;
}
.capability-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 13px;
}
.capability-card {
  position: relative;
  min-height: 223px;
  padding: 27px;
  border: 1px solid rgba(99, 169, 194, 0.22);
  background: var(--panel);
  clip-path: polygon(0 0, calc(100% - 17px) 0, 100% 17px, 100% 100%, 0 100%);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}
.capability-card:hover {
  z-index: 1;
  transform: translateY(-6px);
  border-color: rgba(76, 246, 255, 0.7);
  background: rgba(9, 37, 56, 0.9);
}
.card-code {
  position: absolute;
  top: 18px;
  right: 20px;
  color: #557184;
  font:
    10px ui-monospace,
    monospace;
}
.capability-icon {
  display: block;
  color: var(--cyan);
  font-size: 30px;
  line-height: 1;
  text-shadow: 0 0 17px rgba(76, 246, 255, 0.5);
}
.capability-card h3,
.step h3,
.scenario-card h3 {
  margin: 33px 0 11px;
  font-size: 19px;
}
.capability-card p,
.step p,
.scenario-card p {
  margin: 0;
  color: #99b1c0;
  font-size: 14px;
  line-height: 1.75;
}
.card-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 18px;
  height: 18px;
  border-top: 1px solid var(--magenta);
  transform: rotate(-45deg) translate(7px, 7px);
}
.workflow-section {
  overflow: hidden;
  padding: 96px 0;
  border-top: 1px solid rgba(99, 169, 194, 0.16);
  border-bottom: 1px solid rgba(99, 169, 194, 0.16);
  background: linear-gradient(100deg, rgba(10, 38, 58, 0.7), rgba(17, 6, 45, 0.46));
}
.workflow-top {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 30px;
}
.workflow-top h2 {
  max-width: 620px;
}
.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 57px;
}
.step {
  position: relative;
  padding-top: 31px;
  border-top: 1px solid rgba(130, 197, 219, 0.35);
}
.step::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  width: 7px;
  height: 7px;
  background: var(--cyan);
  box-shadow: 0 0 12px var(--cyan);
}
.step > span {
  color: var(--magenta);
  font:
    14px ui-monospace,
    monospace;
}
.step h3 {
  margin: 24px 0 9px;
}
.step p {
  max-width: 205px;
}
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 13px;
}
.scenario-card {
  min-height: 365px;
  padding: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(99, 169, 194, 0.26);
  background: #0a1728;
  transition: transform 0.25s ease;
}
.scenario-card:hover {
  transform: translateY(-5px);
}
.scenario-card > span,
.scenario-card b {
  position: relative;
  z-index: 1;
  color: var(--cyan);
  font:
    10px ui-monospace,
    monospace;
  letter-spacing: 1px;
}
.scenario-card h3 {
  position: relative;
  z-index: 1;
  margin: 18px 0 8px;
}
.scenario-card p {
  position: relative;
  z-index: 1;
}
.scenario-card b {
  display: block;
  position: absolute;
  bottom: 20px;
  color: #d6faff;
  font-size: 9px;
}
.scenario-visual {
  position: absolute;
  bottom: 53px;
  left: 20px;
  right: 20px;
  height: 142px;
  overflow: hidden;
  opacity: 0.7;
}
.scenario-visual i {
  position: absolute;
  display: block;
  background: var(--cyan);
}
.scenario-visual i:first-child {
  inset: 31px 7px auto;
  height: 70px;
  border: 1px solid var(--cyan);
  background: linear-gradient(135deg, rgba(76, 246, 255, 0.2), transparent);
}
.scenario-visual i:nth-child(2) {
  width: 89px;
  height: 89px;
  right: -17px;
  top: -14px;
  border-radius: 50%;
  background: var(--magenta);
  filter: blur(22px);
  opacity: 0.8;
}
.scenario-visual i:last-child {
  width: 84px;
  height: 2px;
  left: 23px;
  top: 62px;
  background: #e8ffff;
  box-shadow:
    0 12px 0 #e8ffff,
    0 24px 0 #e8ffff;
}
.scenario-2 .scenario-visual i:first-child {
  transform: skewY(-8deg);
  background: linear-gradient(135deg, rgba(240, 76, 255, 0.5), transparent);
}
.scenario-3 .scenario-visual i:first-child {
  width: 65px;
  height: 105px;
  left: 60px;
  top: 9px;
}
.scenario-4 .scenario-visual i:first-child {
  inset: 10px 0 auto;
  height: 103px;
  clip-path: polygon(0 0, 100% 0, 70% 100%, 0 70%);
}
.scenario-2 {
  background: #190c2e;
}
.scenario-3 {
  background: #082431;
}
.scenario-4 {
  background: #10122c;
}
.faq-section {
  padding: 120px 0;
  background: rgba(0, 0, 0, 0.19);
  border-top: 1px solid rgba(99, 169, 194, 0.16);
}
.faq-layout {
  display: grid;
  grid-template-columns: 0.84fr 1.16fr;
  gap: 80px;
}
.faq-intro {
  max-width: 330px;
  margin: 24px 0 0;
  color: var(--muted);
  line-height: 1.8;
}
.faq-list {
  border-top: 1px solid rgba(137, 191, 211, 0.28);
}
.faq-list details {
  border-bottom: 1px solid rgba(137, 191, 211, 0.22);
}
.faq-list summary {
  display: flex;
  align-items: center;
  gap: 19px;
  padding: 24px 0;
  color: #eefcff;
  cursor: pointer;
  list-style: none;
  font-size: 17px;
  font-weight: 700;
}
.faq-list summary::-webkit-details-marker {
  display: none;
}
.faq-list summary span {
  color: var(--magenta);
  font:
    11px ui-monospace,
    monospace;
}
.faq-list summary b {
  margin-left: auto;
  color: var(--cyan);
  font-size: 20px;
  font-weight: 400;
}
.faq-list details[open] summary b {
  transform: rotate(45deg);
}
.faq-list details p {
  margin: 0 35px 24px;
  color: #99b1c0;
  line-height: 1.8;
  font-size: 15px;
}
.closing {
  padding: 116px 0 133px;
  text-align: center;
}
.closing .eyebrow {
  justify-content: center;
}
.closing h2 {
  margin-bottom: 35px;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 82px;
  border-top: 1px solid rgba(119, 177, 202, 0.22);
  color: #6e8798;
  font:
    10px ui-monospace,
    monospace;
  letter-spacing: 0.7px;
}
.footer .brand {
  font-size: 11px;
}
.landing-page :is(a, summary):focus-visible {
  outline: 2px solid var(--magenta);
  outline-offset: 4px;
}
.landing-page {
  scroll-behavior: smooth;
}
@keyframes drift {
  to {
    transform: translate(90px, 50px) scale(1.12);
  }
}
@keyframes floatDemo {
  50% {
    transform: perspective(1300px) rotateY(-7deg) rotateX(2deg) translateY(-9px);
  }
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-top: 70px;
  }
  .hero-copy {
    max-width: 650px;
  }
  .editor-demo {
    max-width: 650px;
    margin: auto;
  }
  .section-heading {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .capability-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .steps {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 38px;
  }
  .scenario-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .faq-layout {
    grid-template-columns: 1fr;
    gap: 52px;
  }
  .nav-links {
    gap: 20px;
    margin-right: 22px;
  }
}
@media (max-width: 600px) {
  .shell {
    width: min(100% - 32px, 1200px);
  }
  .site-header {
    height: 73px;
  }
  .nav-links {
    display: none;
  }
  .site-header .button-small {
    padding: 0 11px;
    font-size: 12px;
  }
  .hero {
    min-height: 0;
    padding: 57px 0 71px;
    gap: 43px;
  }
  .hero h1 {
    font-size: 47px;
    letter-spacing: -2px;
  }
  .hero-description {
    margin: 23px 0;
    font-size: 16px;
  }
  .hero-actions {
    align-items: flex-start;
    flex-direction: column;
    gap: 22px;
  }
  .hero-meta {
    margin-top: 38px;
    gap: 10px 13px;
  }
  .editor-demo {
    transform: none;
  }
  .demo-body {
    grid-template-columns: 42px minmax(0, 1fr);
  }
  .demo-properties {
    display: none;
  }
  .demo-palette {
    padding: 12px 6px;
  }
  .palette-unit {
    width: 24px;
    height: 24px;
  }
  .demo-canvas {
    padding: 27px 15px;
  }
  .canvas-page {
    height: 210px;
    padding: 15px;
  }
  .canvas-heading {
    font-size: 18px;
  }
  .canvas-cards {
    margin-top: 26px;
  }
  .drag-item {
    right: 7px;
    bottom: 20px;
  }
  .section {
    padding: 77px 0;
  }
  .section-heading {
    margin-bottom: 35px;
  }
  .section h2,
  .faq-section h2,
  .closing h2 {
    font-size: 38px;
    letter-spacing: -2px;
  }
  .capability-grid,
  .scenario-grid {
    grid-template-columns: 1fr;
  }
  .capability-card {
    min-height: 190px;
  }
  .workflow-section {
    padding: 72px 0;
  }
  .workflow-top {
    display: block;
  }
  .workflow-top h2 {
    margin-top: 18px;
  }
  .steps {
    grid-template-columns: 1fr;
    gap: 28px;
    margin-top: 42px;
  }
  .step h3 {
    margin-top: 15px;
  }
  .scenario-card {
    min-height: 300px;
  }
  .faq-section {
    padding: 78px 0;
  }
  .faq-layout {
    gap: 43px;
  }
  .faq-list summary {
    font-size: 16px;
  }
  .faq-list details p {
    margin-left: 29px;
  }
  .closing {
    padding: 80px 0 92px;
  }
  .footer {
    gap: 13px;
    padding: 20px 0;
    align-items: flex-start;
    flex-direction: column;
  }
  .footer p {
    margin: 0;
    font-size: 8px;
  }
  .grid-field {
    height: 800px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .landing-page {
    scroll-behavior: auto;
  }
  .orb,
  .editor-demo {
    animation: none;
  }
  .button,
  .capability-card,
  .scenario-card {
    transition: none;
  }
}
</style>
