import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

function CreativeObject() {
  const mesh = useRef(null)
  const group = useRef(null)
  const target = useRef({ x: 0, y: 0, z: 0, scale: 1 })
  const velocity = useRef(0)

  useEffect(() => {
    let lastScroll = window.scrollY
    let frame = 0
    const onMove = (event) => {
      if (!group.current) return
      const x = (event.clientX / window.innerWidth - .5) * 2
      const y = (event.clientY / window.innerHeight - .5) * 2
      const distance = Math.hypot(event.clientX - window.innerWidth * .72, event.clientY - window.innerHeight * .48)
      const proximity = Math.max(0, 1 - distance / 420)
      target.current.x = y * (-.16 - proximity * .08)
      target.current.y = x * (.22 + proximity * .1)
      target.current.scale = 1 + proximity * .08
    }
    const onScroll = () => {
      const current = window.scrollY
      velocity.current = THREE.MathUtils.clamp(current - lastScroll, -35, 35)
      lastScroll = current
    }
    const settle = () => {
      velocity.current *= .9
      target.current.z = THREE.MathUtils.lerp(target.current.z, velocity.current * -.012, .08)
      frame = requestAnimationFrame(settle)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    frame = requestAnimationFrame(settle)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame) }
  }, [])

  useFrame((state, delta) => {
    if (!mesh.current || !group.current) return
    const t = target.current
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, t.x, 3.5, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, t.y, 3.5, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, t.z, 2.5, delta)
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, t.scale, 3, delta))
    mesh.current.rotation.z += delta * (.55 + Math.abs(velocity.current) * .025)
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * .8) * .08
  })

  return <group ref={group}><Float speed={1.4} rotationIntensity={.25} floatIntensity={.55}><mesh ref={mesh} scale={1.75}><icosahedronGeometry args={[1, 2]} /><MeshTransmissionMaterial backside backsideThickness={1} thickness={.6} roughness={.16} transmission={1} ior={1.45} chromaticAberration={.12} anisotropy={.25} color="#f5d90a" /></mesh></Float><mesh scale={1.82} rotation={[.2,.4,.1]}><icosahedronGeometry args={[1, 1]} /><meshBasicMaterial wireframe transparent opacity={.16} color="#111111" /></mesh></group>
}

export default function Hero3D() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return null
  return <div className="hero-3d" aria-hidden="true"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.7], fov: 38 }} gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}><Suspense fallback={null}><ambientLight intensity={1.2} /><directionalLight position={[3,4,5]} intensity={2.4} /><pointLight position={[-3,-2,2]} intensity={8} color="#f5d90a" /><CreativeObject /><Environment preset="studio" /></Suspense></Canvas></div>
}
