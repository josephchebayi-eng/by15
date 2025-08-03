'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { ErrorBoundary } from './error-boundary'

function GlassyFluid() {
  const mesh1 = useRef<THREE.Mesh>(null!)
  const mesh2 = useRef<THREE.Mesh>(null!)
  const mesh3 = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    if (mesh1.current) {
      mesh1.current.rotation.x = Math.sin(time * 0.3) * 0.2
      mesh1.current.rotation.y = Math.cos(time * 0.2) * 0.1
      mesh1.current.position.x = Math.sin(time * 0.2) * 0.5
      mesh1.current.position.y = Math.cos(time * 0.3) * 0.3
    }

    if (mesh2.current) {
      mesh2.current.rotation.x = Math.cos(time * 0.4) * 0.3
      mesh2.current.rotation.z = Math.sin(time * 0.1) * 0.2
      mesh2.current.position.x = Math.cos(time * 0.3) * 0.7
      mesh2.current.position.y = Math.sin(time * 0.2) * 0.4
    }

    if (mesh3.current) {
      mesh3.current.rotation.y = Math.sin(time * 0.5) * 0.2
      mesh3.current.rotation.z = Math.cos(time * 0.3) * 0.1
      mesh3.current.position.x = Math.sin(time * 0.1) * 0.3
      mesh3.current.position.z = Math.cos(time * 0.4) * 0.2
    }
  })

  return (
    <group>
      {/* Large flowing blob */}
      <Sphere ref={mesh1} args={[1.2, 64, 64]} position={[-2, 1, -3]}>
        <MeshDistortMaterial
          color="#3b82f6"
          transparent
          opacity={0.1}
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.1}
        />
      </Sphere>

      {/* Medium flowing blob */}
      <Sphere ref={mesh2} args={[0.8, 64, 64]} position={[2, -1, -2]}>
        <MeshDistortMaterial
          color="#8b5cf6"
          transparent
          opacity={0.08}
          distort={0.6}
          speed={3}
          roughness={0}
          metalness={0.2}
        />
      </Sphere>

      {/* Small flowing blob */}
      <Sphere ref={mesh3} args={[0.5, 64, 64]} position={[0, 0, -1]}>
        <MeshDistortMaterial
          color="#ec4899"
          transparent
          opacity={0.06}
          distort={0.8}
          speed={4}
          roughness={0}
          metalness={0.15}
        />
      </Sphere>
    </group>
  )
}

function FloatingGlassShards() {
  const groupRef = useRef<THREE.Group>(null!)

  const shards = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }))
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += shards[i].rotationSpeed
        child.rotation.z += shards[i].rotationSpeed * 0.5
        child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.001
      })
    }
  })

  return (
    <group ref={groupRef}>
      {shards.map((shard, i) => (
        <Sphere key={i} args={[shard.scale, 16, 16]} position={shard.position}>
          <meshPhysicalMaterial
            color={i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#ec4899"}
            transparent
            opacity={0.04}
            roughness={0}
            metalness={0.1}
            transmission={0.9}
            thickness={0.1}
          />
        </Sphere>
      ))}
    </group>
  )
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
          onError={(error) => console.warn('Three.js Canvas Error:', error)}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />
          <GlassyFluid />
          <FloatingGlassShards />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}
