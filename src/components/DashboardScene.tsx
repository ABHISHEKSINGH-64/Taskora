import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

/**
 * Interactive 3D background for the dashboard.
 * Wireframe icosahedron + orbiting particles; tracks mouse and gently parallaxes.
 */
export function DashboardScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const w = () => el.clientWidth;
    const h = () => el.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w() / h(), 0.1, 200);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    el.appendChild(renderer.domElement);

    const isDark = theme === "dark";
    const accent = isDark ? 0x3ddb85 : 0x1aa362;
    const soft = isDark ? 0xffffff : 0x14141c;

    // Core wireframe icosahedron
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(4.2, 1),
      new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: isDark ? 0.55 : 0.45 }),
    );
    scene.add(core);

    // Inner glow shell
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.6, 0),
      new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.25 }),
    );
    scene.add(shell);

    // Orbiting particles
    const PARTICLES = 240;
    const positions = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < PARTICLES; i++) {
      const r = 7 + Math.random() * 6;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(p) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(p);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: soft, size: 0.06, transparent: true, opacity: isDark ? 0.7 : 0.5 }),
    );
    scene.add(particles);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      core.rotation.y = t * 0.12 + cur.x * 0.6;
      core.rotation.x = t * 0.07 - cur.y * 0.5;
      shell.rotation.y = -t * 0.18;
      shell.rotation.x = t * 0.14;
      particles.rotation.y = t * 0.04 + cur.x * 0.3;
      particles.rotation.x = -cur.y * 0.3;
      camera.position.x += (cur.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-cur.y * 1.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [theme]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
      style={{
        maskImage: "radial-gradient(ellipse at 70% 30%, black 0%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at 70% 30%, black 0%, transparent 75%)",
      }}
    />
  );
}
