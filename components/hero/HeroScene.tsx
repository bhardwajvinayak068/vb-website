'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, RoundedBox } from '@react-three/drei'
import type * as THREE from 'three'
import { supportsWebGL } from '@/lib/supportsWebGL'

function Centerpiece() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.003
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15
  })

  return (
    <group>
      <RoundedBox ref={ref} args={[2, 1.2, 0.2]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#8B98AC" metalness={0.7} roughness={0.25} />
      </RoundedBox>
      <Html position={[1.4, 0.6, 0]} distanceFactor={8} occlude>
        <div className="whitespace-nowrap border-l border-text-low pl-2 font-mono text-[10px] uppercase text-text-mid">
          FIELD ENGINE — CORE MODULE
        </div>
      </Html>
    </group>
  )
}

function LoosePrimitives() {
  const positions: Array<[number, number, number]> = [
    [-2.2, 0.8, -1],
    [2.4, -0.6, -0.5],
    [-1.6, -1.2, 0.5],
    [1.8, 1.4, -1.2],
    [0.4, -1.6, -0.8],
  ]

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[i, i, 0]}>
          {i % 2 === 0 ? (
            <boxGeometry args={[0.25, 0.25, 0.25]} />
          ) : (
            <icosahedronGeometry args={[0.2, 0]} />
          )}
          <meshStandardMaterial color="#141C29" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </>
  )
}

export function HeroScene() {
  // WebGL support can only be feature-detected in the browser. Defaulting to
  // the fallback until a post-mount effect confirms otherwise keeps the
  // server-rendered HTML and the client's first render identical, avoiding a
  // hydration mismatch (the server has no `window` to check at all).
  const [webglReady, setWebglReady] = useState(false)

  useEffect(() => {
    setWebglReady(supportsWebGL())
  }, [])

  if (!webglReady) {
    return (
      <div
        data-testid="hero-scene-fallback"
        className="h-full w-full rounded-2xl bg-gradient-to-br from-concrete to-concrete-deep"
      />
    )
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={1.1} />
      <directionalLight position={[-3, -1, -2]} intensity={0.3} color="#2ECC8F" />
      <Centerpiece />
      <LoosePrimitives />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
