export default function ExperienceCard({ company, title, period, description }) {
  return (
    <article className="exp-card">
      <div className="exp-card-header">
        <h3 className="exp-card-company">{company}</h3>
        <span className="exp-card-period">{period}</span>
      </div>
      <p className="exp-card-title">{title}</p>
      <p className="exp-card-desc">{description}</p>
    </article>
  );
}
