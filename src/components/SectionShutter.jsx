import { useEffect, useRef } from "react";

/**
 * 实习经历 → 项目作品 的分栏百叶转场。
 *
 * 一个覆盖整个视口的 fixed 图层，六条竖栏从屏幕底部错峰上升，
 * 一路延伸到实习经历那一屏，最终成为项目作品那一段的底色。
 *
 * 竖栏只做背景，文字和卡片始终浮在上面。
 * 层叠约定（都在 <main> 同一个层叠上下文里）：
 *   z-index 0  本图层
 *   z-index 1  Hero / 教育 / 实习 / 项目（背景透明，白底交给 body）
 *   z-index 2  联系（不透明，把本图层压在下面）
 */

const COLS = 6; // 竖栏数量，随便改，下面的时序会自动重新分配

/**
 * SPREAD = 错峰级联占整条时间轴的比例，剩下的留给单栏自己走完。
 * 由它反推每栏的错峰量，所以 COLS 改成几都不会超出预算。
 * 调大 → 涟漪感更强、首尾栏差距更大；调小 → 更接近整齐划一。
 */
const SPREAD = 0.36;
const STAGGER = SPREAD / Math.max(COLS - 1, 1);
const SPAN = 1 - SPREAD;
const INDEXES = Array.from({ length: COLS }, (_, i) => i);

/**
 * 打乱起跳顺序：竖栏不再从左到右依次上升，而是散开。
 * 用固定种子的 Fisher–Yates，所以每次刷新的顺序都一样，
 * 换 SEED 就能换一套排布，换 COLS 也能自动适配。
 * ORDER[i] = 第 i 条竖栏排在第几个时间槽。
 */
const SEED = 0xa;

function scatter(n, seed) {
  const slots = Array.from({ length: n }, (_, i) => i);
  let s = seed >>> 0;
  for (let i = n - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return slots;
}

const ORDER = scatter(COLS, SEED);

/**
 * 只在「实习经历被顶出去 → 项目作品钉住」这一段里发生。
 *
 * 交接阶段用 phase 表示：
 *   phase 0  实习经历的 sticky 舞台刚开始上移，项目作品的顶边在视口底
 *   phase 1  项目作品顶边到达视口顶，正式钉住
 *
 * 实习经历自己还钉着的时候 phase 恒为 0，所以那一屏不会有任何动静。
 */
const START_AT = 0.18; // 交接开始后再走 18% 才起步，避免一滑就动
const END_AT = 1; // 到项目作品钉住时升满

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
// 两端都缓，中段匀速，不前重后轻
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function SectionShutter() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ticking = false;

    const compute = () => {
      const projects = document.getElementById("projects");
      if (!projects) return;

      const viewportHeight = window.innerHeight;
      const projectsTop = projects.getBoundingClientRect().top;

      // 交接阶段：项目作品顶边从视口底走到视口顶
      // 实习经历还钉着的时候 projectsTop ≥ viewportHeight，phase 被夹到 0
      const phase = clamp01(1 - projectsTop / viewportHeight);
      const progress = clamp01((phase - START_AT) / (END_AT - START_AT));

      // 完全落下时整层隐藏，省掉一层无谓的合成
      root.style.visibility = progress <= 0.0005 ? "hidden" : "visible";

      for (let i = 0; i < COLS; i++) {
        const raw = (progress - ORDER[i] * STAGGER) / SPAN;
        root.style.setProperty(`--col-${i}`, easeInOutCubic(clamp01(raw)).toFixed(4));
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    const initial = requestAnimationFrame(compute);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="section-shutter" ref={rootRef} aria-hidden="true">
      {INDEXES.map((i) => (
        <span
          key={i}
          className="section-shutter-col"
          style={{ "--p": `var(--col-${i})` }}
        />
      ))}
    </div>
  );
}
