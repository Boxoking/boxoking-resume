export default function ProjectCard({
  name,
  description,
  url,
  image,
  hoverImage,
  imageAlt,
  hoverImageAlt,
  empty,
}) {
  const imageContent = !empty && (
    <>
      <img
        className="project-scroll-image-main"
        src={image}
        alt={imageAlt || `${name}项目背景`}
      />
      <span className="project-scroll-image-preview">
        <img src={hoverImage} alt={hoverImageAlt || `${name}软件界面`} />
      </span>
    </>
  );

  return (
    <article className={`project-scroll-card${empty ? " project-scroll-card--empty" : ""}`}>
      {empty ? (
        <div className="project-scroll-image" aria-hidden="true" />
      ) : url ? (
        <a
          className="project-scroll-image project-scroll-image-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`打开${name}项目`}
        >
          {imageContent}
        </a>
      ) : (
        <div className="project-scroll-image project-scroll-image-link">
          {imageContent}
        </div>
      )}
      <div className="project-scroll-caption">
        {!empty && (
          <>
            <h3>{name}</h3>
            <p>{description}</p>
          </>
        )}
      </div>
    </article>
  );
}
