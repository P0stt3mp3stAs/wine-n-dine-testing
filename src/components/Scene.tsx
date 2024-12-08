'use client';

import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Scene() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container')?.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    camera.position.z = 5;

    const loader = new GLTFLoader();
    loader.load('/models/untitled.gltf', (gltf) => {
      scene.add(gltf.scene);
      renderer.render(scene, camera);
    });

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <div id="scene-container" className="w-full h-screen" />;
}