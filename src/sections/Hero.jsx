import { useEffect, useRef, useState } from "react";
import profile from "../data/profile";
import asset from "../utils/asset";
import ContactCapsules from "../components/ContactCapsules";
import FogBackdrop from "../components/FogBackdrop";

const skillKeywords = [
  "Photoshop",
  "Illustrator",
  "Figma",
  "Codex",
  "Claude Code",
  "SQL",
  "Pandas",
  "Dify",
];

const roleTitles = ["B端产品经理", "AI产品经理"];
const scrambleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>?/";

export function LegacyParticleBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.52;
        mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(p);
          p = rotation * p * 2.03 + 12.7;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv;
        p.x *= u_resolution.x / u_resolution.y;
        p = mat2(0.819, -0.574, 0.574, 0.819) * p;

        float time = u_time * 0.042;
        float broad = fbm(p * 1.12 + vec2(time * 0.15, -time * 0.08));
        vec2 warp = vec2(
          fbm(p * 1.55 + vec2(time * 0.18, 4.3)),
          fbm(p * 1.48 + vec2(-3.1, -time * 0.13))
        );
        float cloud = fbm(p * 1.95 + (warp - 0.5) * 1.08 + vec2(time * 0.10, 0.0));
        float veil = fbm(p * 4.4 + (warp - 0.5) * 0.48 - vec2(time * 0.06, time * 0.02));
        float mist = smoothstep(0.16, 0.90, broad * 0.57 + cloud * 0.33 + veil * 0.10);

        vec2 glowCenterA = vec2(
          0.14 + sin(time * 0.72) * 0.045,
          0.50 + cos(time * 0.58) * 0.055
        );
        vec2 glowCenterB = vec2(
          0.62 + cos(time * 0.47) * 0.07,
          0.23 + sin(time * 0.63) * 0.05
        );
        float glowA = 1.0 - smoothstep(0.04, 0.88, distance(uv, glowCenterA));
        float glowB = 1.0 - smoothstep(0.03, 0.72, distance(uv, glowCenterB));
        float lightField = clamp(mist * 0.30 + glowA * 0.67 + glowB * 0.24, 0.0, 1.0);

        vec3 deepBlue = vec3(0.025, 0.105, 0.265);
        vec3 midBlue = vec3(0.075, 0.285, 0.535);
        vec3 mistBlue = vec3(0.50, 0.67, 0.83);
        vec3 color = mix(deepBlue, midBlue, smoothstep(0.05, 0.70, lightField));
        color = mix(color, mistBlue, smoothstep(0.58, 1.0, lightField) * 0.74);

        vec2 pixel = floor(gl_FragCoord.xy);
        float grainFrame = floor(u_time * 5.0);
        float grainA = hash(pixel + vec2(grainFrame * 17.0, grainFrame * 29.0));
        float grainB = hash(pixel.yx * 1.731 + vec2(grainFrame * 11.0, -grainFrame * 23.0));
        float grain = (grainA + grainB - 1.0) * 0.058;
        grain *= 0.78 + lightField * 0.34;
        color += vec3(grain * 0.72, grain * 0.88, grain);

        float vignette = smoothstep(0.9, 0.28, distance(uv, vec2(0.5)));
        color *= 0.86 + vignette * 0.14;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      canvas.width = Math.round(bounds.width);
      canvas.height = Math.round(bounds.height);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (time = 0) => {
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, reduceMotion ? 0 : time * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particle-canvas" aria-hidden="true" />;
}

function ScrambleRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState(roleTitles[0]);
  const firstRender = useRef(true);

  useEffect(() => {
    const switchTimer = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % roleTitles.length);
    }, 4000);

    return () => window.clearInterval(switchTimer);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return undefined;
    }

    const nextRole = roleTitles[roleIndex];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setDisplayedRole(nextRole);
      return undefined;
    }

    let frame = 0;
    const totalFrames = 14;
    const scrambleTimer = window.setInterval(() => {
      frame += 1;
      const resolvedCount = Math.floor((frame / totalFrames) * nextRole.length);
      const scrambled = Array.from(nextRole, (character, index) => {
        if (index < resolvedCount) return character;
        return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
      }).join("");

      setDisplayedRole(scrambled);

      if (frame >= totalFrames) {
        window.clearInterval(scrambleTimer);
        setDisplayedRole(nextRole);
      }
    }, 45);

    return () => window.clearInterval(scrambleTimer);
  }, [roleIndex]);

  return (
    <>
      <span aria-hidden="true">{displayedRole}</span>
      <span className="sr-only" aria-live="polite">{roleTitles[roleIndex]}</span>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 9L11 13L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  const heroContainerRef = useRef(null);

  useEffect(() => {
    let animationFrame = 0;

    const updateHeroCollapse = () => {
      animationFrame = 0;
      const container = heroContainerRef.current;

      if (container) {
        const scrollDistance = Math.max(window.scrollY, 0);
        const maxCollapse = Math.max(container.offsetHeight - 10, 0);
        const collapse = Math.min(scrollDistance * 0.14, maxCollapse);
        const lift = Math.min(scrollDistance * 0.025, 40);

        container.style.setProperty("--hero-collapse", `${collapse}px`);
        container.style.setProperty("--hero-lift", `${-lift}px`);
      }
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateHeroCollapse);
    };

    updateHeroCollapse();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section id="home" className="hero">
      <div ref={heroContainerRef} className="hero-container">
        <FogBackdrop deeper />
        <img src={asset("images/ns-logo.png")} alt="NS Logo" className="hero-page-logo" />
        <div className="hero-body">
          <div className="hero-text-col">
            <p className="hero-tagline">不仅只是<ScrambleRole /></p>
            <h1 className="hero-name">{profile.nameZh}</h1>
            <p className="hero-positioning">{profile.positioning}</p>
            <p className="hero-bio">{profile.bio}</p>
          </div>

          <div className="hero-actions">
            <a
              className="hero-capsule hero-capsule--resume"
              href={asset("files/Neil-Shi-Resume.pdf")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hero-capsule-icon hero-capsule-icon--blue"><ArrowIcon /></span>
              <span className="hero-capsule-text">下载简历</span>
            </a>

            <ContactCapsules />
          </div>

        </div>

        <img src={asset("images/Neil Shi.png")} alt="Neil Shi signature" className="hero-signature" />

        <div className="hero-skills-band" aria-label={skillKeywords.join("、")}>
          <div className="hero-skills-track">
            {[0, 1].map((copyIndex) => (
              <div className="hero-skills-group" aria-hidden="true" key={copyIndex}>
                {skillKeywords.map((skill) => (
                  <span key={`${copyIndex}-${skill}`} className="hero-skill-item">{skill}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
