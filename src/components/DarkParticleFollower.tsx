import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function DarkParticleFollower() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    particles: THREE.Points[]
    mouse: THREE.Vector2
    attractor: THREE.Vector3
    animationId: number
    time: number
  } | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    camera.position.z = 100

    const mouse = new THREE.Vector2()
    const attractor = new THREE.Vector3(0, 0, 0)
    const particles: THREE.Points[] = []
    let time = 0

    // Space-like particle configurations with cosmic colors
    const particleConfigs = [
      {
        count: 150,
        size: 1.5,
        color: 0x4a90e2, // Cosmic blue
        speed: 0.02,
        attraction: 0.0012,
        spread: 80,
        glow: true
      },
      {
        count: 100,
        size: 2.2,
        color: 0x9b59b6, // Nebula purple
        speed: 0.015,
        attraction: 0.001,
        spread: 70,
        glow: true
      },
      {
        count: 80,
        size: 1.8,
        color: 0x3498db, // Deep space blue
        speed: 0.018,
        attraction: 0.0008,
        spread: 60,
        glow: false
      },
      {
        count: 60,
        size: 3.2,
        color: '0x e74c3c', // Distant star red
        speed: 0.012,
        attraction: 0.0006,
        spread: 50,
        glow: true
      },
      {
        count: 40,
        size: 2.8,
        color: 0xf39c12, // Stellar orange
        speed: 0.01,
        attraction: 0.0004,
        spread: 40,
        glow: true
      },
      {
        count: 30,
        size: 4.0,
        color: 0x1abc9c, // Cosmic teal
        speed: 0.008,
        attraction: 0.0003,
        spread: 35,
        glow: true
      }
    ]

    particleConfigs.forEach((config, index) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(config.count * 3)
      const velocities = new Float32Array(config.count * 3)
      const colors = new Float32Array(config.count * 3)
      const sizes = new Float32Array(config.count)

      for (let i = 0; i < config.count; i++) {
        const i3 = i * 3
        
        // Create more organic, galaxy-like distribution
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * config.spread
        
        positions[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 20
        positions[i3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 20
        positions[i3 + 2] = (Math.random() - 0.5) * 20

        velocities[i3] = (Math.random() - 0.5) * config.speed
        velocities[i3 + 1] = (Math.random() - 0.5) * config.speed
        velocities[i3 + 2] = (Math.random() - 0.5) * config.speed * 0.1

        const color = new THREE.Color(config.color)
        const intensity = 0.6 + Math.random() * 0.4
        color.multiplyScalar(intensity)
        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b

        sizes[i] = config.size * (0.8 + Math.random() * 0.4)
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      // Enhanced material with glow effect
      const material = new THREE.PointsMaterial({
        size: config.size,
        vertexColors: true,
        transparent: true,
        opacity: config.glow ? 0.9 : 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      })

      const particleSystem = new THREE.Points(geometry, material)
      particleSystem.userData = { config, index }
      scene.add(particleSystem)
      particles.push(particleSystem)
    })

    // Beautiful glowing attractor
    const attractorGeometry = new THREE.SphereGeometry(1.5, 32, 32)
    const attractorMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    })
    const attractorMesh = new THREE.Mesh(attractorGeometry, attractorMaterial)
    scene.add(attractorMesh)

    // Add glow effect to attractor
    const glowGeometry = new THREE.SphereGeometry(3, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glowMesh)

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      
      // Convert mouse position to world coordinates
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const pos = camera.position.clone().add(dir.multiplyScalar(distance))
      
      attractor.lerp(pos, 0.1)
      attractorMesh.position.copy(attractor)
      glowMesh.position.copy(attractor)
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    const animate = () => {
      time += 0.01

      particles.forEach((particleSystem, systemIndex) => {
        const positions = particleSystem.geometry.attributes.position.array as Float32Array
        const velocities = particleSystem.geometry.attributes.velocity.array as Float32Array
        const colors = particleSystem.geometry.attributes.color.array as Float32Array
        const sizes = particleSystem.geometry.attributes.size.array as Float32Array
        const config = particleSystem.userData.config

        for (let i = 0; i < positions.length; i += 3) {
          const particleIndex = i / 3
          const x = positions[i]
          const y = positions[i + 1]
          const z = positions[i + 2]

          // Calculate attraction force
          const dx = attractor.x - x
          const dy = attractor.y - y
          const dz = attractor.z - z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
          
          if (distance > 0) {
            const force = config.attraction / (distance * distance + 1)
            velocities[i] += (dx / distance) * force
            velocities[i + 1] += (dy / distance) * force
            velocities[i + 2] += (dz / distance) * force * 0.1
          }

          // Add subtle orbital motion
          const orbitForce = 0.0002
          velocities[i] += -y * orbitForce
          velocities[i + 1] += x * orbitForce

          // Apply velocity with smooth damping
          velocities[i] *= 0.988
          velocities[i + 1] *= 0.988
          velocities[i + 2] *= 0.988

          // Update positions
          positions[i] += velocities[i]
          positions[i + 1] += velocities[i + 1]
          positions[i + 2] += velocities[i + 2]

          // Smooth wrapping around screen edges
          const bounds = 80
          if (positions[i] > bounds) positions[i] = -bounds
          if (positions[i] < -bounds) positions[i] = bounds
          if (positions[i + 1] > bounds * 0.7) positions[i + 1] = -bounds * 0.7
          if (positions[i + 1] < -bounds * 0.7) positions[i + 1] = bounds * 0.7

          // Animate particle colors and sizes for twinkling effect
          if (config.glow) {
            const twinkle = Math.sin(time * 2 + particleIndex * 0.1) * 0.1 + 0.9
            const baseColor = new THREE.Color(config.color)
            baseColor.multiplyScalar(twinkle)
            colors[i] = baseColor.r
            colors[i + 1] = baseColor.g
            colors[i + 2] = baseColor.b
            
            sizes[particleIndex] = config.size * (0.8 + Math.sin(time * 3 + particleIndex * 0.2) * 0.2)
          }
        }

        particleSystem.geometry.attributes.position.needsUpdate = true
        particleSystem.geometry.attributes.velocity.needsUpdate = true
        if (config.glow) {
          particleSystem.geometry.attributes.color.needsUpdate = true
          particleSystem.geometry.attributes.size.needsUpdate = true
        }
      })

      // Gentle camera sway for immersive feel
      camera.position.x = Math.sin(time * 0.5) * 0.5
      camera.position.y = Math.cos(time * 0.3) * 0.3

      // Animate attractor glow
      glowMesh.scale.setScalar(1 + Math.sin(time * 4) * 0.1)
      glowMaterial.opacity = 0.2 + Math.sin(time * 3) * 0.1

      // Very subtle scene rotation for cosmic drift
      scene.rotation.z += 0.0003

      renderer.render(scene, camera)
      const animationId = requestAnimationFrame(animate)
      
      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    sceneRef.current = { scene, camera, renderer, particles, mouse, attractor, animationId: 0, time }
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        sceneRef.current.particles.forEach(particle => {
          particle.geometry.dispose()
          if (particle.material instanceof THREE.Material) {
            particle.material.dispose()
          }
        })
        sceneRef.current.renderer.dispose()
        if (mountRef.current && sceneRef.current.renderer.domElement) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement)
        }
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        ref={mountRef} 
        className="absolute inset-0 block sm:pointer-events-auto"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)
          `,
        }}
      />
    </div>
  )
}