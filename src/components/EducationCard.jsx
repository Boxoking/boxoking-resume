export default function EducationCard({
  school,
  degree,
  major,
  period,
  description,
}) {
  return (
    <article className="experience-card">
      <div className="experience-card-header">
        <h3>{school}</h3>

        <span className="experience-card-company">
          {degree} · {major}
        </span>

        <span className="experience-card-period">
          {period}
        </span>
      </div>

      {description && (
        <p className="education-card-description">
          {description}
        </p>
      )}
    </article>
  );
}