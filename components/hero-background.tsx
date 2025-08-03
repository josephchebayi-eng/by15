'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Torus, Box } from '@react-three/drei'
import * as THREE from 'three'
import { ErrorBoundary } from './error-boundary'

function LargeGlassyBlob() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.3
      meshRef.current.rotation.y = Math.cos(time * 0.15) * 0.2
      meshRef.current.rotation.z = Math.sin(time * 0.05) * 0.1
      meshRef.current.position.x = Math.sin(time * 0.08) * 0.8
      meshRef.current.position.y = Math.cos(time * 0.12) * 0.5
      meshRef.current.position.z = Math.sin(time * 0.06) * 0.3
    }
  })

  return (
    <Sphere ref={meshRef} args={[2.5, 128, 128]} position={[1, 0, -4]}>
      <MeshDistortMaterial
        color="#60a5fa"
        transparent
        opacity={0.15}
        distort={0.8}
        speed={1.5}
        roughness={0}
        metalness={0.2}
        transmission={0.8}
        thickness={0.5}
      />
    </Sphere>
  )
}

function FlowingGlassRings() {
  const ring1 = useRef<THREE.Mesh>(null!)
  const ring2 = useRef<THREE.Mesh>(null!)
  const ring3 = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (ring1.current) {
      ring1.current.rotation.x = time * 0.3
      ring1.current.rotation.y = Math.sin(time * 0.2) * 0.5
      ring1.current.position.y = Math.sin(time * 0.4) * 0.3
    }

    if (ring2.current) {
      ring2.current.rotation.y = time * 0.4
      ring2.current.rotation.z = Math.cos(time * 0.3) * 0.3
      ring2.current.position.x = Math.cos(time * 0.25) * 0.5
    }

    if (ring3.current) {
      ring3.current.rotation.z = time * 0.2
      ring3.current.rotation.x = Math.sin(time * 0.15) * 0.4
      ring3.current.position.z = Math.sin(time * 0.18) * 0.2
    }
  })

  return (
    <group>
      <Torus ref={ring1} args={[1.2, 0.1, 16, 64]} position={[-2, 1, -2]}>
        <meshPhysicalMaterial
          color="#a855f7"
          transparent
          opacity={0.12}
          roughness={0}
          metalness={0.3}
          transmission={0.9}
          thickness={0.2}
        />
      </Torus>

      <Torus ref={ring2} args={[0.8, 0.15, 16, 64]} position={[2, -1, -3]}>
        <meshPhysicalMaterial
          color="#ec4899"
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0.1}
          transmission={0.85}
          thickness={0.3}
        />
      </Torus>

      <Torus ref={ring3} args={[1.5, 0.08, 16, 64]} position={[0, 0, -5]}>
        <meshPhysicalMaterial
          color="#3b82f6"
          transparent
          opacity={0.08}
          roughness={0}
          metalness={0.2}
          transmission={0.95}
          thickness={0.1}
        />
      </Torus>
    </group>
  )
}

function GlassyCubes() {
  const cubes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3 - 2
      ] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      color: i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#8b5cf6" : "#ec4899",
    }))
  }, [])

  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += cubes[i].rotationSpeed
        child.rotation.y += cubes[i].rotationSpeed * 0.7
        child.rotation.z += cubes[i].rotationSpeed * 0.3
        child.position.y += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.002
        child.position.x += Math.cos(state.clock.elapsedTime * 0.3 + i) * 0.001
      })
    }
  })

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => (
        <Box key={i} args={[cube.scale, cube.scale, cube.scale]} position={cube.position}>
          <meshPhysicalMaterial
            color={cube.color}
            transparent
            opacity={0.06}
            roughness={0}
            metalness={0.15}
            transmission={0.92}
            thickness={0.1}
          />
        </Box>
      ))}
    </group>
  )
}

// Check if WebGL is supported
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && canvas.getContext('webgl'))
  } catch (e) {
    return false
  }
}

export default function HeroBackground() {
  // Don't render if WebGL is not supported
  if (typeof window !== 'undefined' && !isWebGLSupported()) {
    return <div className="absolute inset-0 bg-transparent" />
  }

  return (
    <div className="absolute inset-0 z-0">
      <ErrorBoundary fallback={<div className="absolute inset-0 bg-transparent" />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          style={{ background: 'transparent' }}
          gl={{ antialias: true, alpha: true }}
          onError={(error) => console.warn('Three.js Canvas Error:', error)}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.4} color="#8b5cf6" />
          <pointLight position={[5, 5, 2]} intensity={0.3} color="#3b82f6" />
          <spotLight position={[0, 10, 0]} intensity={0.5} color="#ec4899" angle={0.3} />
          <LargeGlassyBlob />
          <FlowingGlassRings />
          <GlassyCubes />
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}
