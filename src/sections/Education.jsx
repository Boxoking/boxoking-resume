import education from "../data/education";

export default function Education() {
  const [first, second] = education.schools;

  return (
    <section id="education" className="education">
      <div className="education-grid">
        <div className="education-image-col">
          <img
            src={education.image}
            alt="Neil Shi"
            className="education-photo"
          />
        </div>

        <div className="education-text-col">
          <p className="edu-label">{education.label}</p>

          <h3 className="edu-school edu-school--primary">
            {first.name}
            {first.tag && (
              <span className="edu-school-tag">{first.tag}</span>
            )}
          </h3>

          <p className="edu-major-line">
            <span>{first.major}</span>
            <span>{first.period}</span>
          </p>

          <h3 className="edu-school edu-school--secondary">
            {second.name}
          </h3>

          <p className="edu-major-line">
            <span>{second.major}</span>
            <span>{second.period}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
