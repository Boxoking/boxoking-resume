import { useCallback, useEffect, useState } from "react";
import projects from "../data/projects";
import ProjectCard from "../components/ProjectCard";

const CARD_HEIGHT = 554;
const CARD_GAP = 25;
const CARD_COUNT = projects.length;
const CARD_STACK_HEIGHT = CARD_HEIGHT * CARD_COUNT + CARD_GAP * (CARD_COUNT - 1);
const TOP_MARGIN = 170;
const BOTTOM_MARGIN = 170;

export default function Projects() {
  const [translateY, setTranslateY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const compute = useCallback(() => {
    const section = document.getElementById("projects");
    if (!section) return;

    const viewportHeight = window.innerHeight;
    const sectionRect = section.getBoundingClientRect();

    const mobile = window.matchMedia("(max-width: 900px)").matches;
    setIsMobile(mobile);

    if (mobile) {
      setTranslateY(0);
      return;
    }

    const scrollRange = section.offsetHeight - viewportHeight;
    const visibleArea = viewportHeight - TOP_MARGIN - BOTTOM_MARGIN;
    const travelDistance = Math.max(0, CARD_STACK_HEIGHT - visibleArea);

    if (scrollRange <= 0 || travelDistance <= 0) {
      setTranslateY(0);
      return;
    }

    const progress = Math.max(0, Math.min(1, -sectionRect.top / scrollRange));
    setTranslateY(-progress * travelDistance);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    const initialFrame = requestAnimationFrame(compute);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [compute]);

  return (
    <section id="projects" className="projects-scroll-section">
      <div className="projects-scroll-stage">
        <div className="projects-scroll-copy">
          <p className="projects-scroll-label">项目作品</p>
          <h2 className="projects-scroll-heading">以AI为产品能力，也以AI为工作方式</h2>
          <p className="projects-scroll-desc">
            围绕真实需求开展产品实践，使用AI辅助创意构思、需求梳理、界面设计与功能开发，快速完成从想法到可交互产品的实现，并通过持续测试与迭代提升方案的完整性和可用性。
          </p>

          <div className="projects-demo-list">
            <a
              className="projects-demo-item projects-demo-item--link"
              href={projects[0].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>APS排产软件Demo</span>
            </a>
            <a
              className="projects-demo-item projects-demo-item--link"
              href={projects[1].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{projects[1].name}</span>
            </a>
          </div>
        </div>

        <div className="projects-cards-viewport">
          <div
            className="projects-card-stack"
            style={!isMobile ? { transform: `translate3d(0, ${translateY}px, 0)` } : undefined}
          >
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
