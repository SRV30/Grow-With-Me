import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

function CreativeObject({ sceneRef }) {
  const mesh = useRef(null)
  const group = useRef(null)
  const target = useRef({ x: 0, y: 0, scale: 1, px: 0, py: 0 })
  const velocity = useRef(0)
  useEffect(() => {
    if (sceneRef) sceneRef.current = group.current
    let lastScroll = window.scrollY
    const onMove = (event) => {
      if (!group.current) return
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      const distance = Math.hypot(
        event.clientX - window.innerWidth * 0.72,
        event.clientY - window.innerHeight * 0.48,
      )
      const proximity = Math.max(0, 1 - distance / 420)
      target.current.px = y * (-0.16 - proximity * 0.08)
      target.current.py = x * (0.22 + proximity * 0.1)
      target.current.scale = 1 + proximity * 0.08
    }
    const onScroll = () => {
      const current = window.scrollY
      velocity.current = THREE.MathUtils.clamp(current - lastScroll, -35, 35)
      lastScroll = current
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      if (sceneRef) sceneRef.current = null
    }
  }, [sceneRef])
  useFrame((state, delta) => {
    if (!mesh.current || !group.current) return
    const scroll = group.current.userData.scroll || { x: 0, y: 0, z: 0 }
    const t = target.current
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      t.px + scroll.x,
      3.5,
      delta,
    )
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      t.py + scroll.y,
      3.5,
      delta,
    )
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, scroll.z, 2.5, delta)
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      scroll.x * 1.8,
      3.5,
      delta,
    )
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      scroll.y * 1.2,
      3.5,
      delta,
    )
    group.current.position.z = THREE.MathUtils.damp(
      group.current.position.z,
      scroll.z * 1.4,
      3.5,
      delta,
    )
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, t.scale + Math.abs(scroll.z) * 0.08, 3, delta),
    )
    mesh.current.rotation.z += delta * (0.55 + Math.abs(velocity.current) * 0.025)
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08
    velocity.current *= Math.pow(0.9, delta * 60)
  })
  return (
    <group ref={group} userData={{ scroll: { x: 0, y: 0, z: 0 } }}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.55}>
        <mesh ref={mesh} scale={1.75}>
          <icosahedronGeometry args={[1, 2]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={1}
            thickness={0.6}
            roughness={0.16}
            transmission={1}
            ior={1.45}
            chromaticAberration={0.12}
            anisotropy={0.25}
            color="#f5d90a"
          />
        </mesh>
      </Float>
      <mesh scale={1.82} rotation={[0.2, 0.4, 0.1]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial wireframe transparent opacity={0.16} color="#111111" />
      </mesh>
    </group>
  )
}

export default function Hero3D() {
  const [webgl, setWebgl] = useState(true)
  const sceneRef = useRef(null)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const small = typeof window !== 'undefined' && window.innerWidth < 768
  useEffect(() => {
    if (reduced || coarse || small) return undefined
    const canvas = document.createElement('canvas')
    setWebgl(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    return undefined
  }, [reduced, coarse, small])
  useEffect(() => {
    if (!webgl || reduced || coarse || small) return undefined
    let frame = 0
    let cleanup
    const setup = () => {
      const scene = sceneRef.current
      const services = document.querySelector('#services')
      const work = document.querySelector('#work')
      if (!scene || !services || !work) {
        frame = requestAnimationFrame(setup)
        return
      }
      const trigger = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: '70% top',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress
          scene.userData.scroll = {
            x: THREE.MathUtils.lerp(0, 0.75, p),
            y: THREE.MathUtils.lerp(0, -0.35, p),
            z: THREE.MathUtils.lerp(0, -0.7, p),
          }
        },
      })
      const serviceTrigger = ScrollTrigger.create({
        trigger: services,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          scene.userData.scroll = {
            x: THREE.MathUtils.lerp(0.75, -0.55, self.progress),
            y: THREE.MathUtils.lerp(-0.35, 0.45, self.progress),
            z: THREE.MathUtils.lerp(-0.7, -0.15, self.progress),
          }
        },
      })
      const workTrigger = ScrollTrigger.create({
        trigger: work,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 1,
        onUpdate: (self) => {
          scene.userData.scroll = {
            x: THREE.MathUtils.lerp(-0.55, 0.8, self.progress),
            y: THREE.MathUtils.lerp(0.45, -0.15, self.progress),
            z: THREE.MathUtils.lerp(-0.15, 0.25, self.progress),
          }
        },
      })
      ScrollTrigger.refresh()
      cleanup = () => {
        trigger.kill()
        serviceTrigger.kill()
        workTrigger.kill()
      }
    }
    frame = requestAnimationFrame(setup)
    return () => {
      cancelAnimationFrame(frame)
      cleanup?.()
    }
  }, [webgl, reduced, coarse, small])
  if (!webgl || reduced || coarse || small) return null
  return (
    <div className="hero-3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 4.7], fov: 38 }}
        frameloop="always"
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 4, 5]} intensity={2.4} />
          <pointLight position={[-3, -2, 2]} intensity={8} color="#f5d90a" />
          <CreativeObject sceneRef={sceneRef} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  )
}
