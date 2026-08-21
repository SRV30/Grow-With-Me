import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

function CreativeObject() {
  const mesh = useRef(null)
  const group = useRef(null)
  useEffect(() => {
    const onMove = (event) => {
      if (!group.current) return
      const x = (event.clientX / window.innerWidth - .5) * 2
      const y = (event.clientY / window.innerHeight - .5) * 2
      group.current.userData.target = { x: y * -.16, y: x * .22 }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  useFrame((state) => {
    if (!mesh.current || !group.current) return
    const target = group.current.userData.target || { x: 0, y: 0 }
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, target.x, .035)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target.y, .035)
    mesh.current.rotation.z += .0025
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * .8) * .08
  })
  return <group ref={group} userData={{ target: { x: 0, y: 0 } }}><Float speed={1.4} rotationIntensity={.25} floatIntensity={.55}><mesh ref={mesh} scale={1.75}><icosahedronGeometry args={[1, 2]} /><MeshTransmissionMaterial backside backsideThickness={1} thickness={.6} roughness={.16} transmission={1} ior={1.45} chromaticAberration={.12} anisotropy={.25} color="#f5d90a" /></mesh></Float><mesh scale={1.82} rotation={[.2,.4,.1]}><icosahedronGeometry args={[1, 1]} /><meshBasicMaterial wireframe transparent opacity={.16} color="#111111" /></mesh></group>
}

export default function Hero3D() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return null
  return <div className="hero-3d" aria-hidden="true"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.7], fov: 38 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}><Suspense fallback={null}><ambientLight intensity={1.2} /><directionalLight position={[3,4,5]} intensity={2.4} /><pointLight position={[-3,-2,2]} intensity={8} color="#f5d90a" /><CreativeObject /><Environment preset="studio" /></Suspense></Canvas></div>
}
