import ContactCapsules from "../components/ContactCapsules";

export default function Contact() {
  return (
    <section id="contact" className="contact-panel">
      <div className="contact-hero-content">
        <h2 className="exp-section-heading contact-heading">从需求出发，以AI工具推动产品决策与设计表达。</h2>
        <div className="hero-actions contact-hero-actions">
          <ContactCapsules />
        </div>
      </div>
    </section>
  );
}
