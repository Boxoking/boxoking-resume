import { useEffect, useRef, useState, useCallback } from "react";
import experience from "../data/experience";
import ExperienceCard from "../components/ExperienceCard";
import asset from "../utils/asset";

const CARD_HEIGHT = 350;
const CARD_GAP = 25;
const CARD_COUNT = experience.length;
const CARD_STACK_HEIGHT = CARD_HEIGHT * CARD_COUNT + CARD_GAP * (CARD_COUNT - 1);
const TOP_MARGIN = 170; // card stack top from viewport top
const BOTTOM_MARGIN = 170; // bottom card margin from viewport bottom
const SECTION_MIN_HEIGHT = TOP_MARGIN + CARD_STACK_HEIGHT + BOTTOM_MARGIN;

export default function Experience() {
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const isMobileRef = useRef(false);
  const [translateY, setTranslateY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const compute = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mqMobile = window.matchMedia("(max-width: 900px)").matches;
    isMobileRef.current = mqMobile;
    setIsMobile(mqMobile);

    if (mqMobile) {
      setTranslateY(0);
      return;
    }

    const viewportHeight = window.innerHeight;
    const sectionHeight = section.offsetHeight;
    const scrollRange = sectionHeight - viewportHeight;

    if (scrollRange <= 0) {
      setTranslateY(0);
      return;
    }

    const stageHeight = viewportHeight;
    const cardTopWithinStage = TOP_MARGIN;
    const visibleArea = stageHeight - cardTopWithinStage - BOTTOM_MARGIN;
    const travelDistance = Math.max(0, CARD_STACK_HEIGHT - visibleArea);

    if (travelDistance <= 0) {
      setTranslateY(0);
      return;
    }

    const sectionRect = section.getBoundingClientRect();
    const rawProgress = -sectionRect.top / scrollRange;
    const progress = Math.max(0, Math.min(1, rawProgress));

    setTranslateY(-progress * travelDistance);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          compute();
          ticking = false;
        });
        ticking = true;
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [compute]);

  return (
    <section
      id="experience"
      className="experience-section"
      ref={sectionRef}
      style={{ "--experience-section-min-height": `${SECTION_MIN_HEIGHT}px` }}
    >
      <div className="experience-stage">
        <div className="experience-copy">
          <p className="exp-section-label">实习经历</p>
          <h2 className="exp-section-heading">
            数字化，自动化，AI 提效与产品落地
          </h2>
          <p className="exp-section-desc">
            覆盖工业 SaaS、智能硬件、物联网多类 B
            端场景，提供从需求调研、流程设计到项目落地的完整产品能力，搭建标准化业务数据体系，支撑
            AI 预警、智能问答等功能落地，以产品化手段提效业务流程。
          </p>
          <a
            className="exp-consult-btn"
            href={asset("files/Neil-Shi-Resume.pdf")}
            download="史云浩简历.pdf"
          >
            <span className="exp-consult-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 9L11 13L15 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="exp-consult-text">下载简历</span>
          </a>
        </div>

        <div className="experience-cards-viewport">
          <div
            className="experience-card-stack"
            ref={stackRef}
            style={
              !isMobile
                ? { transform: `translate3d(0, ${translateY}px, 0)` }
                : undefined
            }
          >
            {experience.map((item, index) => (
              <ExperienceCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
