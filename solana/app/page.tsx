'use client'

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const router = useRouter(); // Initialize useRouter
  const targetRef = useRef(null);
  const canvasRef = useRef(null);
  const footerCanvasRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const starVertices = [];
  
    for (let i = 0; i < starCount; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starVertices.push(x, y, z);
    }
  
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
  
    camera.position.z = 500;
  
    const animate = () => {
      requestAnimationFrame(animate);
      starField.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();
  
    gsap.to(starField.rotation, {
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: targetRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  
    return () => {
      renderer.dispose();
    };
  }, []);

  // Add the 3D torus knot to the footer
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: footerCanvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create the torus knot
    const geometry = new THREE.TorusKnotGeometry(12, 3, 120, 30);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    camera.position.z = 30;

    const animateKnot = () => {
      requestAnimationFrame(animateKnot);
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animateKnot();

    // Scroll-triggered rotation
    gsap.to(torusKnot.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: targetRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    return () => {
      renderer.dispose();
    };
  }, []);

  // Click handler for the button
  const handleButtonClick = () => {
    router.push('/dashboard');
  };

  return (
    <div className="landing-page">
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="content">
        <div className="hero">
          <h1>STEP</h1>
          <p>Your Web3 Dashboard for All Things DeFi and NFT</p>
          <button onClick={handleButtonClick}>Track Portfolio</button>
        </div>
        <section ref={targetRef} className="scroll-section">
          <div className="sticky-container">
            <motion.div style={{ x }} className="card-container">
              {cards.map((card) => (
                <Card key={card.id} card={card} />
              ))}
            </motion.div>
          </div>
        </section>
        <div className="footer">
          <canvas ref={footerCanvasRef} className="knot-canvas" />
        </div>
      </div>
    </div>
  );
};

const Card = ({ card }) => {
  const backgroundClass = `card-background id${card.id}`;
  
  return (
    <div className="card">
      <div className={backgroundClass} />
      <div className="card-content">
        <h1>{card.title}</h1>
        <p>{card.description}</p>
      </div>
    </div>
  );
};

const cards = [
  { url: "/api/placeholder/450/450", title: "See everything", description:"Track balances and complex positions across an extensive range of projects on Solana.", id: 1 },
  { url: "/api/placeholder/450/450", title: "Built for Defi", description:"Compound and claim rewards easily from a variety of protocols and yield farms.", id: 2 },
  { url: "/api/placeholder/450/450", title: "View your NFTs", description: "View and send NFTs for your own address, or view NFTs for any address on chain.", id: 3 },
  { url: "/api/placeholder/450/450", title: "The STEP token", description: "Step's tokenomics are designed to drive usage of the platform, while rewarding users and holders.", id: 4 },
  { url: "/api/placeholder/450/450", title: "Access our API", description:"Step's API is designed to track transactions and DeFi activity and can be tailored to your needs. Contact us to learn more about our services and pricing.", id: 5 },
];

export default LandingPage;
