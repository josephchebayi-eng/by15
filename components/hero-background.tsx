'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  return (
    <Sphere ref={meshRef} args={[1, 100, 100]} position={[2, 0, -5]}>
      <meshBasicMaterial
        color="#10b981"
        wireframe
        transparent
        opacity={0.1}
      />
    </Sphere>
  )
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null!)
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    const colors = new Float32Array(1000 * 3)
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      
      const color = new THREE.Color()
      color.setHSL(0.33 + Math.random() * 0.1, 0.7, 0.6 + Math.random() * 0.3)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    
    return [positions, colors]
  }, [])
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.05
      ref.current.rotation.y += delta * 0.1
      
      const positions = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + positions[i]) * 0.001
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.01}
        sizeAttenuation={true}
        depthWrite={false}
      />
      <bufferAttribute
        attach="geometry-attributes-color"
        count={colors.length / 3}
        array={colors}
        itemSize={3}
      />
    </Points>
  )
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingParticles />
        <AnimatedSphere />
      </Canvas>
    </div>
  )
}
