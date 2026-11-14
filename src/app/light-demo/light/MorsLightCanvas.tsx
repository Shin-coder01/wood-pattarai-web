"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { COLOR_PRESETS, INITIAL_LIGHT, type LightingSettings } from "./config";

type LightRig = {
  spot: THREE.SpotLight;
  bulbLight: THREE.PointLight;
  bulbMaterial: THREE.MeshStandardMaterial;
  glowMaterial: THREE.SpriteMaterial;
  undersideMaterial: THREE.MeshStandardMaterial;
  backgroundMaterial: THREE.MeshStandardMaterial | null;
};

const DOWN = new THREE.Vector3(0, -1, 0);
const UP = new THREE.Vector3(0, 1, 0);
const BASE_LIGHT_DIRECTION = DOWN.clone();

type Props = {
  mediaRef?: RefObject<HTMLPictureElement | null>;
  imageRef?: RefObject<HTMLImageElement | null>;
  lighting: LightingSettings;
  roomBright: boolean;
  onLightingChange: (patch: Partial<LightingSettings>) => void;
  onLampTouch?: () => void;
};

export function MorsLightCanvas({
  mediaRef,
  imageRef,
  lighting,
  roomBright,
  onLightingChange,
  onLampTouch,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightRigRef = useRef<LightRig | null>(null);
  const activeColorRef = useRef(new THREE.Color());
  const backgroundColorTargetRef = useRef(new THREE.Color(0x16181d));
  const backgroundEmissionTargetRef = useRef(0.012);
  const wakeRef = useRef<(() => void) | null>(null);
  const lightingRef = useRef(lighting);
  const [error, setError] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const activeCanvas: HTMLCanvasElement = canvas;

    let disposed = false;
    let frame = 0;
    let animationFrame = 0;
    let resizeFrame = 0;
    let lastTime = performance.now();
    let accumulator = 0;
    let stableFrames = 0;
    let pulling = false;
    let pullPointerId = -1;
    let lampTapCandidate = false;
    let lampPointerStartX = 0;
    let lampPointerStartY = 0;
    let lastPointerTime = 0;
    let pullStrength = 0;
    let beamPointerId = -1;
    let beamStartX = 0;
    let beamStartY = 0;
    let beamStartAngle = INITIAL_LIGHT.angle;
    let beamDragged = false;

    const fixedStep = 1 / 120;
    const ropeLength = 1.22;
    const lampCeilingOffset = 0.55;
    const gravity = new THREE.Vector3(0, -9.81, 0);
    const anchor = new THREE.Vector3(0, 4.72, 1.18);
    const allowEntrySway = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const position = new THREE.Vector3(
      allowEntrySway ? 0.16 : 0,
      anchor.y - ropeLength,
      anchor.z + (allowEntrySway ? 0.08 : 0),
    );
    const previous = position.clone().add(
      allowEntrySway ? new THREE.Vector3(0.018, 0, -0.012) : new THREE.Vector3(),
    );
    const aimTarget = new THREE.Vector3(0, 0.3, 0.08);
    const pointerVelocity = new THREE.Vector3();
    const lastPointerTarget = aimTarget.clone();

    const temp = new THREE.Vector3();
    const tempB = new THREE.Vector3();
    const tempC = new THREE.Vector3();
    const resizeOffset = new THREE.Vector3();
    const velocity = new THREE.Vector3();
    const ropeDirection = new THREE.Vector3();
    const lightDirection = new THREE.Vector3();
    const currentLightDirection = BASE_LIGHT_DIRECTION.clone();
    const midpoint = new THREE.Vector3();
    const swingQuaternion = new THREE.Quaternion();
    const lampQuaternion = new THREE.Quaternion();
    const cableQuaternion = new THREE.Quaternion();
    const pointer = new THREE.Vector2();
    const lampNdc = new THREE.Vector3();
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.08);
    const raycaster = new THREE.Raycaster();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (rendererError) {
      console.error(rendererError);
      const errorTimer = window.setTimeout(() => {
        if (!disposed) {
          setError("This pendant light needs WebGL to render.");
        }
      }, 0);
      return () => {
        disposed = true;
        window.clearTimeout(errorTimer);
      };
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x010204, 0);

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 80);
    camera.position.set(0, 0.2, 13.6);

    const backgroundImage = imageRef?.current ?? null;
    const backgroundMedia = mediaRef?.current ?? null;
    const backgroundCanvas = backgroundImage && backgroundMedia ? document.createElement("canvas") : null;
    const backgroundContext = backgroundCanvas?.getContext("2d") ?? null;
    let backgroundTexture: THREE.CanvasTexture | null = null;
    let backgroundMesh: THREE.Mesh | null = null;
    let backgroundMaterial: THREE.MeshStandardMaterial | null = null;
    if (backgroundCanvas && backgroundContext) {
      backgroundTexture = new THREE.CanvasTexture(backgroundCanvas);
      backgroundTexture.colorSpace = THREE.SRGBColorSpace;
      backgroundTexture.minFilter = THREE.LinearFilter;
      backgroundTexture.magFilter = THREE.LinearFilter;
      backgroundTexture.generateMipmaps = false;
      backgroundMaterial = new THREE.MeshStandardMaterial({
        map: backgroundTexture,
        emissive: 0xffffff,
        emissiveMap: backgroundTexture,
        emissiveIntensity: 0.012,
        roughness: 0.96,
        metalness: 0,
        color: 0x16181d,
        side: THREE.DoubleSide,
      });
      backgroundMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), backgroundMaterial);
      backgroundMesh.position.z = -0.08;
      backgroundMesh.renderOrder = -1;
      scene.add(backgroundMesh);
    }

    const ambient = new THREE.HemisphereLight(0x71809b, 0x151118, 0.58);
    scene.add(ambient);

    const fillLight = new THREE.DirectionalLight(0x91a6c8, 0.24);
    fillLight.position.set(-4.8, 5.6, 7.4);
    scene.add(fillLight);

    const lampRoot = new THREE.Group();
    scene.add(lampRoot);

    const ceilingCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.3, 0.11, 24),
      new THREE.MeshStandardMaterial({ color: 0x101218, roughness: 0.64, metalness: 0.7 }),
    );
    ceilingCap.position.copy(anchor).add(new THREE.Vector3(0, 0.08, 0));
    scene.add(ceilingCap);

    const cable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 1, 10),
      new THREE.MeshStandardMaterial({ color: 0x121318, roughness: 0.5, metalness: 0.55 }),
    );
    scene.add(cable);

    const shadeGroup = new THREE.Group();
    lampRoot.add(shadeGroup);

    const shadeProfile = [
      new THREE.Vector2(0.08, 0.08),
      new THREE.Vector2(0.18, 0.02),
      new THREE.Vector2(0.43, -0.1),
      new THREE.Vector2(0.82, -0.25),
      new THREE.Vector2(1.08, -0.36),
      new THREE.Vector2(1.1, -0.41),
    ];
    const shadeMaterial = new THREE.MeshStandardMaterial({
      color: 0x101116,
      roughness: 0.36,
      metalness: 0.74,
      side: THREE.DoubleSide,
    });
    const shade = new THREE.Mesh(new THREE.LatheGeometry(shadeProfile, 48), shadeMaterial);
    shadeGroup.add(shade);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(1.095, 0.027, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0x17191f, roughness: 0.28, metalness: 0.82 }),
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = -0.397;
    shadeGroup.add(rim);

    const undersideMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(INITIAL_LIGHT.color).multiplyScalar(0.18),
      emissive: INITIAL_LIGHT.color,
      emissiveIntensity: 0.42,
      roughness: 0.92,
      side: THREE.DoubleSide,
    });
    const underside = new THREE.Mesh(new THREE.CircleGeometry(1.055, 48), undersideMaterial);
    underside.rotation.x = Math.PI / 2;
    underside.position.y = -0.385;
    shadeGroup.add(underside);

    const connector = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.12, 0.2, 20),
      new THREE.MeshStandardMaterial({ color: 0x9c6744, roughness: 0.44, metalness: 0.66 }),
    );
    connector.position.y = 0.08;
    shadeGroup.add(connector);

    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd7ad,
      emissive: INITIAL_LIGHT.color,
      emissiveIntensity: 3.2,
      roughness: 0.2,
    });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 12), bulbMaterial);
    bulb.scale.y = 1.2;
    bulb.position.y = -0.33;
    shadeGroup.add(bulb);

    const glowTexture = createGlowTexture();
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: INITIAL_LIGHT.color,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.position.y = -0.36;
    glow.scale.set(0.96, 0.96, 0.96);
    shadeGroup.add(glow);

    const spot = new THREE.SpotLight(
      INITIAL_LIGHT.color,
      1,
      18,
      THREE.MathUtils.degToRad(INITIAL_LIGHT.angle),
      0.88,
      2,
    );
    spot.power = INITIAL_LIGHT.brightness;
    spot.position.set(0, -0.35, 0);
    spot.target.position.set(0, -7, 0);
    shadeGroup.add(spot, spot.target);

    const bulbLight = new THREE.PointLight(INITIAL_LIGHT.color, 1, 3.2, 2);
    bulbLight.power = 36;
    bulbLight.position.set(0, -0.35, 0);
    shadeGroup.add(bulbLight);

    lightRigRef.current = {
      spot,
      bulbLight,
      bulbMaterial,
      glowMaterial,
      undersideMaterial,
      backgroundMaterial,
    };

    function createGlowTexture() {
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 64;
      textureCanvas.height = 64;
      const context = textureCanvas.getContext("2d");
      if (context) {
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.16, "rgba(255,222,172,.8)");
        gradient.addColorStop(0.46, "rgba(255,170,94,.22)");
        gradient.addColorStop(1, "rgba(255,140,70,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    function updateBackgroundTexture() {
      if (!backgroundCanvas || !backgroundContext || !backgroundTexture || !backgroundImage || !backgroundMedia) return;
      if (!backgroundImage.complete || backgroundImage.naturalWidth < 1 || backgroundImage.naturalHeight < 1) return;

      const bounds = backgroundMedia.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.25 : 1.5);
      backgroundCanvas.width = Math.max(1, Math.round(width * dpr));
      backgroundCanvas.height = Math.max(1, Math.round(height * dpr));

      const sourceWidth = backgroundImage.naturalWidth;
      const sourceHeight = backgroundImage.naturalHeight;
      const coverScale = Math.max(width / sourceWidth, height / sourceHeight);
      const imageLeft = (width - sourceWidth * coverScale) / 2;
      const imageTop = (height - sourceHeight * coverScale) / 2;
      const zoom = window.matchMedia("(min-width: 761px)").matches ? 1.68 : 1;
      const viewLeft = width * (1 - 1 / zoom);
      const viewTop = height * (0.5 - 0.5 / zoom);
      const sourceLeft = THREE.MathUtils.clamp((viewLeft - imageLeft) / coverScale, 0, sourceWidth - 1);
      const sourceTop = THREE.MathUtils.clamp((viewTop - imageTop) / coverScale, 0, sourceHeight - 1);
      const drawWidth = Math.min((width / zoom) / coverScale, sourceWidth - sourceLeft);
      const drawHeight = Math.min((height / zoom) / coverScale, sourceHeight - sourceTop);

      backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
      backgroundContext.drawImage(
        backgroundImage,
        sourceLeft,
        sourceTop,
        drawWidth,
        drawHeight,
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height,
      );
      backgroundTexture.needsUpdate = true;
    }

    function resize() {
      const width = Math.max(1, activeCanvas.clientWidth);
      const height = Math.max(1, activeCanvas.clientHeight);
      if (!pulling) {
        resizeOffset.copy(position).sub(anchor);
        if (resizeOffset.lengthSq() < 0.001) resizeOffset.copy(DOWN);
        resizeOffset.normalize().multiplyScalar(ropeLength);
      }
      const dpr = Math.min(window.devicePixelRatio || 1, width < 760 ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      updateBackgroundTexture();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const portrait = height > width * 1.16;
      const frameWidth = portrait ? 7.2 : 12.8;
      const frameHeight = portrait ? 11.8 : 7.2;
      const frameTop = portrait ? -0.62 : -0.38;
      anchor.set(0, frameTop + frameHeight / 2 + lampCeilingOffset, portrait ? 1.1 : 1.18);
      ceilingCap.position.copy(anchor);
      ceilingCap.position.y += 0.08;

      const fitHeight = frameHeight + 3.1;
      const fitWidth = frameWidth + 1.25;
      const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const distanceForHeight = fitHeight / (2 * Math.tan(halfFov));
      const distanceForWidth = fitWidth / (2 * Math.tan(halfFov) * camera.aspect);
      const viewportScale = Math.max(1, height / Math.max(1, window.innerHeight));
      const cameraDistance = Math.max(distanceForHeight, distanceForWidth) * viewportScale;
      const cameraDrop = portrait ? 0.78 : 0.62;
      const upwardTarget = portrait ? -0.04 : 0.06;
      camera.position.set(0, frameTop - cameraDrop, cameraDistance);
      camera.lookAt(0, frameTop + upwardTarget, 0);
      camera.updateMatrixWorld();
      const viewWidth = 2 * cameraDistance * Math.tan(halfFov) * camera.aspect;
      anchor.x = viewWidth * 0.18;
      ceilingCap.position.copy(anchor);
      ceilingCap.position.y += 0.08;
      if (!pulling) {
        position.copy(anchor).add(resizeOffset);
        previous.copy(position);
      }
      if (backgroundMesh) {
        const backgroundCenter = new THREE.Vector3(0, frameTop + upwardTarget, -0.08);
        backgroundMesh.position.copy(backgroundCenter);
        backgroundMesh.quaternion.copy(camera.quaternion);
        const backgroundDistance = camera.position.distanceTo(backgroundCenter);
        const backgroundHeight = 2 * backgroundDistance * Math.tan(halfFov);
        backgroundMesh.scale.set(backgroundHeight * camera.aspect, backgroundHeight, 1);
      }
      wake();
    }

    function updateRig() {
      ropeDirection.copy(position).sub(anchor).normalize();
      midpoint.copy(anchor).add(position).multiplyScalar(0.5);
      cable.position.copy(midpoint);
      cable.scale.set(1, ropeLength, 1);
      cableQuaternion.setFromUnitVectors(UP, ropeDirection);
      cable.quaternion.copy(cableQuaternion);

      if (pulling) {
        lightDirection.copy(aimTarget).sub(position).normalize();
        currentLightDirection.lerp(lightDirection, 0.32).normalize();
      } else {
        swingQuaternion.setFromUnitVectors(DOWN, ropeDirection);
        lightDirection.copy(BASE_LIGHT_DIRECTION).applyQuaternion(swingQuaternion).normalize();
        currentLightDirection.lerp(lightDirection, 0.14).normalize();
      }
      lampQuaternion.setFromUnitVectors(DOWN, currentLightDirection);
      lampRoot.position.copy(position);
      lampRoot.quaternion.copy(lampQuaternion);

    }

    function stepPhysics() {
      velocity.copy(position).sub(previous).multiplyScalar(pulling ? 0.985 : 0.9948);
      previous.copy(position);
      position.add(velocity).addScaledVector(gravity, fixedStep * fixedStep);

      if (pulling) {
        // The pointer defines a 3D equilibrium direction. Distance controls how
        // much of that direction is applied, like stretching an invisible spring.
        tempB.copy(aimTarget).sub(anchor).normalize();
        tempB.lerp(DOWN, 1 - pullStrength * 0.82).normalize();
        tempC.copy(tempB).multiplyScalar(ropeLength).add(anchor).sub(position);
        temp.copy(position).sub(anchor).normalize();
        tempC.addScaledVector(temp, -tempC.dot(temp));
        position.addScaledVector(tempC, 52 * fixedStep * fixedStep);
      }

      temp.copy(position).sub(anchor);
      if (temp.lengthSq() < 1e-8) temp.copy(DOWN);
      temp.normalize().multiplyScalar(ropeLength);
      position.copy(anchor).add(temp);

      velocity.copy(position).sub(previous);
      if (pulling) {
        stableFrames = 0;
      } else if (velocity.lengthSq() < 0.000000014) {
        stableFrames += 1;
      } else {
        stableFrames = 0;
      }
    }

    function animate(time: number) {
      animationFrame = 0;
      if (disposed) return;

      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      backgroundMaterial?.color.lerp(backgroundColorTargetRef.current, Math.min(1, delta * 5));
      if (backgroundMaterial) {
        backgroundMaterial.emissiveIntensity = THREE.MathUtils.lerp(
          backgroundMaterial.emissiveIntensity,
          backgroundEmissionTargetRef.current,
          Math.min(1, delta * 5),
        );
      }
      accumulator = Math.min(accumulator + delta, fixedStep * 5);
      while (accumulator >= fixedStep) {
        stepPhysics();
        accumulator -= fixedStep;
      }

      updateRig();
      renderer.render(scene, camera);
      frame += 1;

      if (pulling || stableFrames < 80 || frame < 4) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    function wake() {
      stableFrames = 0;
      if (!animationFrame && !disposed) {
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(animate);
      }
    }

    wakeRef.current = wake;

    function pointerNdc(event: PointerEvent) {
      const rect = activeCanvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    }

    function updatePointerTarget(event: PointerEvent) {
      pointerNdc(event);
      if (!raycaster.ray.intersectPlane(interactionPlane, aimTarget)) return false as const;

      lampNdc.copy(position).project(camera);
      const distanceX = (pointer.x - lampNdc.x) * camera.aspect;
      const distanceY = pointer.y - lampNdc.y;
      const pointerDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      pullStrength = THREE.MathUtils.smoothstep(pointerDistance, 0.08, 1.15);
      return pointerDistance;
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button === 2) {
        beamPointerId = event.pointerId;
        beamStartX = event.clientX;
        beamStartY = event.clientY;
        beamStartAngle = lightingRef.current.angle;
        beamDragged = false;
        return;
      }
      if (event.button !== 0 || beamPointerId !== -1) return;
      const pointerDistance = updatePointerTarget(event);
      if (pointerDistance === false) return;
      lampTapCandidate = pointerDistance < 0.17;
      lampPointerStartX = event.clientX;
      lampPointerStartY = event.clientY;
      if (lampTapCandidate) onLampTouch?.();

      pulling = true;
      pullPointerId = event.pointerId;
      lastPointerTime = performance.now();
      lastPointerTarget.copy(aimTarget);
      pointerVelocity.set(0, 0, 0);
      activeCanvas.classList.add("is-pulling-light");
      wake();
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerId === beamPointerId) {
        const movementX = event.clientX - beamStartX;
        const movementY = event.clientY - beamStartY;
        if (!beamDragged && Math.hypot(movementX, movementY) >= 4) beamDragged = true;
        if (beamDragged) {
          const nextAngle = THREE.MathUtils.clamp(Math.round(beamStartAngle + movementX * 0.14), 16, 58);
          if (lightingRef.current.angle !== nextAngle) onLightingChange({ angle: nextAngle });
          wake();
        }
        return;
      }
      if (!pulling || event.pointerId !== pullPointerId) return;
      if (Math.hypot(event.clientX - lampPointerStartX, event.clientY - lampPointerStartY) >= 4) {
        lampTapCandidate = false;
      }
      if (updatePointerTarget(event) === false) return;
      const now = performance.now();
      const elapsed = Math.max(0.008, Math.min(0.05, (now - lastPointerTime) / 1000));
      temp.copy(aimTarget).sub(lastPointerTarget).multiplyScalar(1 / elapsed);
      pointerVelocity.lerp(temp, 0.34);
      lastPointerTarget.copy(aimTarget);
      lastPointerTime = now;
      wake();
    }

    function onPointerUp(event: PointerEvent) {
      if (event.pointerId === beamPointerId) {
        const shouldCycleColor = !beamDragged && event.type !== "pointercancel";
        beamPointerId = -1;
        beamDragged = false;
        if (shouldCycleColor) {
          const currentIndex = COLOR_PRESETS.findIndex((color) => color === lightingRef.current.color.toLowerCase());
          onLightingChange({ color: COLOR_PRESETS[(currentIndex + 1) % COLOR_PRESETS.length] });
        }
        wake();
        return;
      }
      if (!pulling || event.pointerId !== pullPointerId) return;
      const pointerTravel = Math.hypot(event.clientX - lampPointerStartX, event.clientY - lampPointerStartY);
      const shouldNudgeLamp = lampTapCandidate && pointerTravel < 4 && event.type !== "pointercancel";
      lampTapCandidate = false;

      // Preserve current motion, add pointer momentum, then add a small spring
      // return impulse. A farther pull therefore releases with more energy.
      velocity.copy(position).sub(previous).multiplyScalar(1 / fixedStep);
      temp.copy(position).sub(anchor).normalize();
      pointerVelocity.addScaledVector(temp, -pointerVelocity.dot(temp)).clampLength(0, 6);
      const pointerTransfer = THREE.MathUtils.lerp(0.055, 0.12, pullStrength);
      velocity.addScaledVector(pointerVelocity, pointerTransfer);

      tempB.copy(anchor).addScaledVector(DOWN, ropeLength).sub(position);
      tempB.addScaledVector(temp, -tempB.dot(temp));
      if (tempB.lengthSq() > 0.0001) {
        tempB.normalize();
        const returnImpulse = THREE.MathUtils.lerp(0.32, 1.6, pullStrength);
        velocity.addScaledVector(tempB, returnImpulse);
      }
      if (shouldNudgeLamp && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tempB.set(1, 0, 0).addScaledVector(temp, -tempB.dot(temp));
        if (tempB.lengthSq() > 0.0001) velocity.addScaledVector(tempB.normalize(), 0.42);
      }
      velocity.clampLength(0, 4.25);
      previous.copy(position).addScaledVector(velocity, -fixedStep);

      pulling = false;
      pullPointerId = -1;
      lampTapCandidate = false;
      pullStrength = 0;
      activeCanvas.classList.remove("is-pulling-light");
      wake();
    }

    function resetMotion() {
      pulling = false;
      pullPointerId = -1;
      pullStrength = 0;
      position.copy(anchor).addScaledVector(DOWN, ropeLength);
      previous.copy(position);
      pointerVelocity.set(0, 0, 0);
      currentLightDirection.copy(BASE_LIGHT_DIRECTION);
      activeCanvas.classList.remove("is-pulling-light");
      beamPointerId = -1;
      beamDragged = false;
      wake();
    }

    function onResize() {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    }

    function onContextMenu(contextEvent: MouseEvent) {
      contextEvent.preventDefault();
    }

    activeCanvas.addEventListener("pointerdown", onPointerDown);
    activeCanvas.addEventListener("dblclick", resetMotion);
    activeCanvas.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("resize", onResize, { passive: true });
    backgroundImage?.addEventListener("load", onResize);

    resize();
    updateRig();
    wake();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(resizeFrame);
      activeCanvas.removeEventListener("pointerdown", onPointerDown);
      activeCanvas.removeEventListener("dblclick", resetMotion);
      activeCanvas.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
      backgroundImage?.removeEventListener("load", onResize);
      wakeRef.current = null;
      lightRigRef.current = null;
      backgroundMesh?.geometry.dispose();
      backgroundMaterial?.dispose();
      backgroundTexture?.dispose();
      shade.geometry.dispose();
      shadeMaterial.dispose();
      rim.geometry.dispose();
      (rim.material as THREE.Material).dispose();
      underside.geometry.dispose();
      undersideMaterial.dispose();
      connector.geometry.dispose();
      (connector.material as THREE.Material).dispose();
      bulb.geometry.dispose();
      bulbMaterial.dispose();
      cable.geometry.dispose();
      (cable.material as THREE.Material).dispose();
      ceilingCap.geometry.dispose();
      (ceilingCap.material as THREE.Material).dispose();
      glowTexture.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, [imageRef, mediaRef, onLampTouch, onLightingChange]);

  useEffect(() => {
    lightingRef.current = lighting;
    const rig = lightRigRef.current;
    if (!rig) return;

    const color = activeColorRef.current.set(lighting.color);
    const effectiveBrightness = lighting.enabled ? lighting.brightness : 0;
    rig.spot.color.copy(color);
    rig.spot.power = effectiveBrightness;
    rig.spot.angle = THREE.MathUtils.degToRad(lighting.angle);
    rig.bulbLight.color.copy(color);
    rig.bulbLight.power = lighting.enabled ? Math.max(18, lighting.brightness * 0.026) : 0;
    rig.bulbMaterial.emissive.copy(color);
    rig.bulbMaterial.emissiveIntensity = lighting.enabled ? 2.4 + lighting.brightness / 850 : 0.04;
    rig.glowMaterial.color.copy(color);
    rig.glowMaterial.opacity = lighting.enabled ? 0.52 + lighting.brightness / 4200 : 0;
    rig.undersideMaterial.color.copy(color).multiplyScalar(0.18);
    rig.undersideMaterial.emissive.copy(color);
    rig.undersideMaterial.emissiveIntensity = lighting.enabled ? 0.22 + lighting.brightness / 7250 : 0.03;
    wakeRef.current?.();
  }, [lighting]);

  useEffect(() => {
    backgroundColorTargetRef.current.set(roomBright ? 0xffffff : 0x16181d);
    backgroundEmissionTargetRef.current = roomBright ? 0.78 : 0.012;
    wakeRef.current?.();
  }, [roomBright]);

  return (
    <>
      <canvas ref={canvasRef} className="webgl-canvas" aria-label="Interactive Three.js pendant light" />
      {error ? <div className="scene-error" role="status">{error}</div> : null}
    </>
  );
}
