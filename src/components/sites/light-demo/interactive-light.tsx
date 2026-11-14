"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./interactive-light.module.css";

const concepts = {
  Space: "A sandbox universe where runtime state evolves with clear boundaries.",
  Meta: "A basic game unit that owns fields and receives rules.",
  Field: "Explicit data that keeps layout derivable and tightly packed.",
  Rule: "Rules declare what they need, and runtime derives the layout.",
  Latent: "Long-lived space-level systems for global capability and reusable scratch.",
} as const;

type Concept = keyof typeof concepts;

type LightingSettings = {
  enabled: boolean;
  angle: number;
  brightness: number;
  color: string;
};

type SwingMotion = {
  angle: number;
  velocity: number;
  dragging: boolean;
  pointerId: number;
  previousTime: number;
  pointerStartX: number;
  pointerStartY: number;
  moved: boolean;
};

type BeamDrag = {
  pointerId: number;
  startX: number;
  startAngle: number;
};

const initialLighting: LightingSettings = {
  enabled: true,
  angle: 34,
  brightness: 1450,
  color: "#ffb36b",
};

const colorPresets = ["#ffb36b", "#ffd9a3", "#8fdcff", "#c79cff", "#ff5f7f"] as const;
const pendulumLength = 1.22;
const ropePixels = 128;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function InteractiveLight() {
  const stageRef = useRef<HTMLElement>(null);
  const motionRef = useRef<SwingMotion>({
    angle: 0,
    velocity: 0,
    dragging: false,
    pointerId: -1,
    previousTime: 0,
    pointerStartX: 0,
    pointerStartY: 0,
    moved: false,
  });
  const beamDragRef = useRef<BeamDrag | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [concept, setConcept] = useState<Concept>("Space");
  const [lighting, setLighting] = useState<LightingSettings>(initialLighting);
  const [aimAngle, setAimAngle] = useState(0);

  const applySwing = (angle: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    motionRef.current.angle = angle;
    stage.style.setProperty("--lamp-x", `${Math.sin(angle) * ropePixels}px`);
    stage.style.setProperty("--swing-angle", `${angle}rad`);
  };

  const wakeSwing = () => {
    if (animationFrameRef.current !== null) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const motion = motionRef.current;
      motion.angle = 0;
      motion.velocity = 0;
      applySwing(0);
      return;
    }

    let previousFrameTime = performance.now();
    const tick = (time: number) => {
      animationFrameRef.current = null;
      const motion = motionRef.current;
      if (motion.dragging) return;

      const delta = Math.min((time - previousFrameTime) / 1000, 0.05);
      previousFrameTime = time;
      motion.velocity += -(9.81 / pendulumLength) * Math.sin(motion.angle) * delta;
      motion.velocity *= Math.pow(0.9948, delta * 120);
      motion.angle += motion.velocity * delta;
      applySwing(motion.angle);

      if (Math.abs(motion.angle) > 0.0015 || Math.abs(motion.velocity) > 0.0015) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
      } else {
        motion.angle = 0;
        motion.velocity = 0;
        applySwing(0);
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const resetLight = () => {
    setLighting(initialLighting);
    setAimAngle(0);
    beamDragRef.current = null;
    const motion = motionRef.current;
    motion.dragging = false;
    motion.pointerId = -1;
    motion.velocity = 0;
    motion.moved = false;
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    applySwing(0);
  };

  const handleLampPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const motion = motionRef.current;
    motion.dragging = true;
    motion.pointerId = event.pointerId;
    motion.velocity = 0;
    motion.previousTime = performance.now();
    motion.pointerStartX = event.clientX;
    motion.pointerStartY = event.clientY;
    motion.moved = false;
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handleStagePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 2) return;
    if ((event.target as HTMLElement).closest("[data-interactive]")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    beamDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startAngle: aimAngle,
    };
  };

  const handleStagePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const motion = motionRef.current;
    if (motion.dragging && event.pointerId === motion.pointerId) {
      if (Math.hypot(event.clientX - motion.pointerStartX, event.clientY - motion.pointerStartY) >= 4) {
        motion.moved = true;
      }
      const stage = stageRef.current;
      if (!stage) return;
      const bounds = stage.getBoundingClientRect();
      const anchorX = bounds.left + bounds.width / 2;
      const anchorY = bounds.top + 8;
      const dx = event.clientX - anchorX;
      const dy = event.clientY - anchorY;
      const nextAngle = clamp(Math.atan2(dx, ropePixels + dy), -0.94, 0.94);
      const now = performance.now();
      const elapsed = Math.max(0.001, (now - motion.previousTime) / 1000);
      motion.velocity = (nextAngle - motion.angle) / elapsed;
      motion.previousTime = now;
      applySwing(nextAngle);
      return;
    }

    const beamDrag = beamDragRef.current;
    if (beamDrag && event.pointerId === beamDrag.pointerId) {
      setAimAngle(clamp(beamDrag.startAngle + (event.clientX - beamDrag.startX) * 0.12, -32, 32));
    }
  };

  const handleStagePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const motion = motionRef.current;
    if (motion.dragging && event.pointerId === motion.pointerId) {
      const pointerTravel = Math.hypot(event.clientX - motion.pointerStartX, event.clientY - motion.pointerStartY);
      if (!motion.moved && pointerTravel < 4 && event.type !== "pointercancel") motion.velocity = 0.55;
      motion.dragging = false;
      motion.pointerId = -1;
      motion.moved = false;
      wakeSwing();
    }
    if (beamDragRef.current?.pointerId === event.pointerId) {
      beamDragRef.current = null;
    }
  };

  const handleContextMenu = (event: ReactMouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("[data-interactive]")) return;
    event.preventDefault();
    setLighting((current) => {
      const currentIndex = colorPresets.indexOf(current.color as (typeof colorPresets)[number]);
      const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % colorPresets.length;
      return { ...current, color: colorPresets[nextIndex] };
    });
  };

  const handleDoubleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("[data-interactive]")) return;
    resetLight();
  };

  const handleLampKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    const nextAngle = clamp(motionRef.current.angle + direction * 0.08, -0.94, 0.94);
    motionRef.current.velocity = direction * 0.65;
    applySwing(nextAngle);
    wakeSwing();
  };

  const intensity = lighting.enabled ? lighting.brightness / 2600 : 0;
  const sceneStyle = {
    "--lamp-color": lighting.color,
    "--light-intensity": intensity.toFixed(3),
    "--pool-intensity": (intensity * 0.92).toFixed(3),
    "--surface-intensity": (intensity * 0.7).toFixed(3),
    "--beam-opacity": (intensity * 0.82).toFixed(3),
    "--bulb-opacity": (lighting.enabled ? 0.2 + intensity * 0.8 : 0.04).toFixed(3),
    "--beam-width": `${Math.round(200 + lighting.angle * 15)}px`,
    "--aim-angle": `${aimAngle}deg`,
    "--aim-shift": `${Math.tan((aimAngle * Math.PI) / 180) * 340}px`,
  } as CSSProperties;

  return (
    <main
      ref={stageRef}
      className={styles.page}
      style={sceneStyle}
      data-light-enabled={lighting.enabled}
      onPointerDown={handleStagePointerDown}
      onPointerMove={handleStagePointerMove}
      onPointerUp={handleStagePointerUp}
      onPointerCancel={handleStagePointerUp}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      <nav className={styles.utilityBar} aria-label="Light study links">
        <a href="/">← Prathap home</a>
        <a href="https://github.com/jinruozai/HTML-Light-Demo" target="_blank" rel="noreferrer">
          Concept @kaolti · demo by Jinruozai · source ↗
        </a>
      </nav>

      <div className={styles.stage}>
        <div className={styles.ambientGrid} aria-hidden="true" />
        <div className={styles.lightPool} aria-hidden="true" />

        <section className={styles.surface} aria-labelledby="light-study-title">
          <header className={styles.pageHeader}>
            <div className={styles.pageBrand}>
              <span className={styles.pageLogo} aria-hidden="true">M</span>
              <span>MORS²</span>
              <span className={styles.brandSuffix}>GAME ENGINE</span>
            </div>
            <div className={styles.pageStatus}><span /> EARLY DEVELOPMENT</div>
          </header>

          <div className={styles.pageMain}>
            <section className={styles.pageCopy} aria-labelledby="light-study-title">
              <p className={styles.pageKicker}>01 / RUNTIME ARCHITECTURE</p>
              <h1 id="light-study-title">
                Meta is observed<br />
                by Rule to <span>Step in Space.</span>
              </h1>
              <p className={styles.pageSubtitle}>
                A Rust engine architecture where rules derive tightly packed data layout for elegant performance.
              </p>
              <div className={styles.concepts} data-interactive>
                <div className={styles.conceptList} role="group" aria-label="MORS² engine model">
                  {(Object.keys(concepts) as Concept[]).map((item, index) => (
                    <button
                      key={item}
                      type="button"
                      className={concept === item ? styles.isActive : undefined}
                      onClick={() => setConcept(item)}
                      aria-pressed={concept === item}
                    >
                      <span>0{index + 1}</span>{item}
                    </button>
                  ))}
                </div>
                <p className={styles.conceptDescription}>
                  <span>{concept}</span>{concepts[concept]}
                </p>
              </div>
            </section>

            <aside className={styles.lightControls} data-interactive aria-label="Spotlight controls">
              <div className={styles.controlHeading}>
                <div>
                  <p>LIGHT CONTROL</p>
                  <span>PHYSICAL SPOT / 01</span>
                </div>
                <button
                  type="button"
                  className={`${styles.powerToggle} ${lighting.enabled ? styles.powerOn : ""}`}
                  onClick={() => setLighting((current) => ({ ...current, enabled: !current.enabled }))}
                  aria-pressed={lighting.enabled}
                  aria-label={lighting.enabled ? "Turn spotlight off" : "Turn spotlight on"}
                >
                  <span />{lighting.enabled ? "ON" : "OFF"}
                </button>
              </div>

              <label className={styles.controlRow}>
                <span className={styles.controlLabel}><b>BEAM</b><output>{lighting.angle}°</output></span>
                <input
                  type="range"
                  min="16"
                  max="58"
                  step="1"
                  value={lighting.angle}
                  onChange={(event) => setLighting((current) => ({ ...current, angle: Number(event.currentTarget.value) }))}
                  aria-label="Spotlight beam angle"
                />
              </label>

              <label className={styles.controlRow}>
                <span className={styles.controlLabel}><b>BRIGHTNESS</b><output>{lighting.brightness} lm</output></span>
                <input
                  type="range"
                  min="300"
                  max="2600"
                  step="50"
                  value={lighting.brightness}
                  onChange={(event) => setLighting((current) => ({ ...current, brightness: Number(event.currentTarget.value) }))}
                  aria-label="Spotlight brightness"
                />
              </label>

              <div className={styles.colorControl}>
                <span className={styles.controlLabel}><b>COLOR</b><output>{lighting.color.toUpperCase()}</output></span>
                <div className={styles.colorOptions}>
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={lighting.color === color ? styles.isActive : undefined}
                      style={{ "--swatch": color } as CSSProperties}
                      onClick={() => setLighting((current) => ({ ...current, color }))}
                      aria-label={`Set light color to ${color}`}
                      aria-pressed={lighting.color === color}
                    />
                  ))}
                  <label className={styles.customColor} aria-label="Choose a custom light color">
                    <input
                      type="color"
                      value={lighting.color}
                      onChange={(event) => setLighting((current) => ({ ...current, color: event.currentTarget.value }))}
                    />
                    <span>+</span>
                  </label>
                </div>
              </div>

              <label className={styles.controlRow}>
                <span className={styles.controlLabel}><b>AIM</b><output>{aimAngle}°</output></span>
                <input
                  type="range"
                  min="-32"
                  max="32"
                  step="1"
                  value={aimAngle}
                  onChange={(event) => setAimAngle(Number(event.currentTarget.value))}
                  aria-label="Aim spotlight"
                />
              </label>

              <button type="button" className={styles.resetLight} onClick={resetLight}>
                RESET LIGHT <span>↗</span>
              </button>
            </aside>
          </div>

          <footer className={styles.pageFooter}>
            <p>SPACE / META / FIELD / RULE / LATENT</p>
            <div className={styles.dragInstruction}>
              <span className={styles.dragOrbit} aria-hidden="true"><i /></span>
              <div><b>LMB PULL · RMB LIGHT</b><span>Right-drag beam · Right-click color</span></div>
            </div>
            <p>FOUNDATION FIRST — OPEN SOURCE WHEN READY</p>
          </footer>
        </section>

        <button
          type="button"
          className={styles.lampHandle}
          aria-label="Tap the hanging lamp for a small swing, or drag it to pull and aim the light. Use arrow keys to swing it."
          title="Tap for a small swing · Drag to pull · Arrow keys also work"
          onPointerDown={handleLampPointerDown}
          onKeyDown={handleLampKeyDown}
        >
          <span className={styles.ceilingCap} />
          <span className={styles.cable} />
          <span className={styles.lampShade} />
          <span className={styles.bulb} />
          <span className={styles.beam} />
        </button>

        <div className={styles.sceneStatus} aria-live="polite">
          <span /> DRAG THE LIGHT TO EXPLORE
        </div>
      </div>
    </main>
  );
}
