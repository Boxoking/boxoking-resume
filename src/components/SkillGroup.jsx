export default function SkillGroup({ category, items }) {
  return (
    <div className="skill-group">
      <h3 className="skill-group-title">{category}</h3>
      <div className="skill-group-tags">
        {items.map((item) => (
          <span key={item} className="skill-tag">{item}</span>
        ))}
      </div>
    </div>
  );
}
