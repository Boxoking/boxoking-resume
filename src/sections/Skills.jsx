import SectionTitle from "../components/SectionTitle";
import SkillGroup from "../components/SkillGroup";
import skills from "../data/skills";

export default function Skills() {
  return (
    <section id="skills">
      <SectionTitle title="专业技能" subtitle="产品与工具能力" />
      <div className="skills-grid">
        {skills.map((group, index) => (
          <SkillGroup key={index} {...group} />
        ))}
      </div>
    </section>
  );
}
