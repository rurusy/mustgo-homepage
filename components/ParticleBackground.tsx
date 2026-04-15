"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MAX_LINE_PAIRS = 2000;
const LINK_DIST_SQ = 4000; // squared distance threshold; avoids sqrt per pair

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const motionMQ =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let prefersReducedMotion = !!motionMQ?.matches;

    const particleCount = window.innerWidth < 768 ? 60 : 100;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 250;
    camera.position.x = -50;

    const colorBlue = new THREE.Color(0x42a5f5);
    const colorGreen = new THREE.Color(0x8bc34a);
    const colorLightGrey = new THREE.Color(0xe0e0e0);

    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    // Packed velocities: [vx0, vy0, vz0, vx1, ...] — avoids object indirection.
    const velocities = new Float32Array(particleCount * 3);

    const spread = 400;
    const halfSpread = spread / 2;
    const quarterSpread = spread / 4;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread * 1.5;
      positions[i3 + 1] = (Math.random() - 0.5) * spread;
      positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.5;

      velocities[i3] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;

      const pColor =
        Math.random() > 0.7
          ? colorBlue
          : Math.random() > 0.5
            ? colorGreen
            : colorLightGrey;
      colors[i3] = pColor.r;
      colors[i3 + 1] = pColor.g;
      colors[i3 + 2] = pColor.b;
    }

    const posAttr = new THREE.BufferAttribute(positions, 3);
    const colAttr = new THREE.BufferAttribute(colors, 3);
    particles.setAttribute("position", posAttr);
    particles.setAttribute("color", colAttr);

    const pMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_LINE_PAIRS * 2 * 3);
    const lineColors = new Float32Array(MAX_LINE_PAIRS * 2 * 3);
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3);
    const lineColAttr = new THREE.BufferAttribute(lineColors, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineColAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute("position", linePosAttr);
    lineGeometry.setAttribute("color", lineColAttr);
    lineGeometry.setDrawRange(0, 0);
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    let rafId = 0;
    let paused = false;

    function renderFrame() {
      // Index the underlying Float32Arrays directly — avoid getX/setX overhead.
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        let x = positions[i3] + velocities[i3];
        let y = positions[i3 + 1] + velocities[i3 + 1];
        let z = positions[i3 + 2] + velocities[i3 + 2];

        if (x > spread || x < -spread) velocities[i3] *= -1;
        if (y > halfSpread || y < -halfSpread) velocities[i3 + 1] *= -1;
        if (z > quarterSpread || z < -quarterSpread) velocities[i3 + 2] *= -1;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }
      posAttr.needsUpdate = true;

      let pairCount = 0;
      outer: for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const xi = positions[i3];
        const yi = positions[i3 + 1];
        const zi = positions[i3 + 2];
        const ri = colors[i3];
        const gi = colors[i3 + 1];
        const bi = colors[i3 + 2];
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const dx = xi - positions[j3];
          const dy = yi - positions[j3 + 1];
          const dz = zi - positions[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < LINK_DIST_SQ) {
            const base = pairCount * 6;
            linePositions[base] = xi;
            linePositions[base + 1] = yi;
            linePositions[base + 2] = zi;
            linePositions[base + 3] = positions[j3];
            linePositions[base + 4] = positions[j3 + 1];
            linePositions[base + 5] = positions[j3 + 2];

            lineColors[base] = ri;
            lineColors[base + 1] = gi;
            lineColors[base + 2] = bi;
            lineColors[base + 3] = colors[j3];
            lineColors[base + 4] = colors[j3 + 1];
            lineColors[base + 5] = colors[j3 + 2];

            pairCount++;
            if (pairCount >= MAX_LINE_PAIRS) break outer;
          }
        }
      }

      lineGeometry.setDrawRange(0, pairCount * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      particleSystem.rotation.y += 0.001;
      linesMesh.rotation.y = particleSystem.rotation.y;

      renderer.render(scene, camera);
    }

    function animate() {
      if (paused) return;
      rafId = requestAnimationFrame(animate);
      renderFrame();
    }

    if (prefersReducedMotion) {
      renderFrame();
    } else {
      animate();
    }

    function onVisibilityChange() {
      if (document.hidden) {
        paused = true;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else if (!prefersReducedMotion) {
        paused = false;
        animate();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Debounced resize — avoid thrashing renderer.setSize/projection updates.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    function applyResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (prefersReducedMotion) renderFrame();
    }
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyResize, 150);
    }
    window.addEventListener("resize", onResize);

    // React to users toggling reduced-motion mid-session.
    function onMotionChange(e: MediaQueryListEvent) {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        paused = true;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        renderFrame();
      } else {
        paused = false;
        animate();
      }
    }
    motionMQ?.addEventListener?.("change", onMotionChange);

    return () => {
      paused = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionMQ?.removeEventListener?.("change", onMotionChange);
      scene.remove(linesMesh);
      lineGeometry.dispose();
      particles.dispose();
      pMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
