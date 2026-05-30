import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const isDark = theme === "dark";
    const palette = isDark
      ? [0x3ddb85, 0xf5a623, 0xe8453c, 0x5b6ef5]
      : [0x1aa362, 0xd68910, 0xc43328, 0x3a4ee8];

    const cols = 18;
    const rows = 14;
    const spacing = 1.6;
    const nodes: { mesh: THREE.Mesh; baseScale: number; phase: number }[] = [];

    const geom = new THREE.SphereGeometry(0.11, 12, 12);
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const color = palette[Math.floor(Math.random() * palette.length)];
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set((x - cols / 2) * spacing, (y - rows / 2) * spacing, (Math.random() - 0.5) * 2);
        group.add(mesh);
        nodes.push({ mesh, baseScale: 1, phase: Math.random() * Math.PI * 2 });
      }
    }

    // line connections (subtle grid)
    const lineMat = new THREE.LineBasicMaterial({
      color: isDark ? 0xffffff : 0x14141c,
      transparent: true,
      opacity: isDark ? 0.06 : 0.08,
    });
    for (let x = 0; x < cols - 1; x++) {
      for (let y = 0; y < rows; y++) {
        const a = nodes[x * rows + y].mesh.position;
        const b = nodes[(x + 1) * rows + y].mesh.position;
        const g = new THREE.BufferGeometry().setFromPoints([a, b]);
        group.add(new THREE.Line(g, lineMat));
      }
    }
    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols; x++) {
        const a = nodes[x * rows + y].mesh.position;
        const b = nodes[x * rows + (y + 1)].mesh.position;
        const g = new THREE.BufferGeometry().setFromPoints([a, b]);
        group.add(new THREE.Line(g, lineMat));
      }
    }

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      group.rotation.y = t * 0.08 + mouse.x * 0.25;
      group.rotation.x = -mouse.y * 0.2;
      nodes.forEach((n) => {
        const s = 1 + Math.sin(t * 2 + n.phase) * 0.35;
        n.mesh.scale.setScalar(s);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [theme]);

  return <div ref={ref} className="absolute inset-0 -z-10" />;
}
