// FaceLoginDescriptors.jsx
import { useRef, useState, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'
import Swal from 'sweetalert2'
import euclideanDistance from 'euclidean-distance'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '/src/hooks/useAuth'


export default function FaceLoginDescriptors() {
    const videoRef = useRef()
    const [modelsLoaded, setModelsLoaded] = useState(false)
    const [registered, setRegistered] = useState([]) // { id, nombre, descriptor }
    const [reconocido, setReconocido] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const [mensaje, setMensaje] = useState("")
    useEffect(() => {
        // 1) Carga modelos
        const loadModels = async () => {
            console.log("Cargando modelos...");

            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
                ])
                setModelsLoaded(true)
                console.log("Modelos cargados")
            } catch (error) {
                console.error("Error cargando modelos:", error)
                Swal.fire('Error', 'No se pudieron cargar los modelos de reconocimiento facial', 'error')
            }

        }


        loadModels()
    }, [])

    // 2) Carga usuarios registrados desde el backend
    useEffect(() => {
        axios.get('http://localhost:3001/api/usuarios')
            .then(({ data }) => {
                console.log('DATA RECIBIDA:', data)
                const registrados = data
                    .filter(u => u.face_descriptor)
                    .map(u => ({
                        id: u.id,
                        nombre: u.nombre,
                        descriptor: u.face_descriptor.map(parseFloat)
                    }))
                setRegistered(registrados)
            })
            .catch(() => Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error'))
    }, [])

    // 3) Cámara
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(s => (videoRef.current.srcObject = s))
            .catch(() => Swal.fire('Error', 'No se pudo acceder a la cámara', 'error'))

        return () => videoRef.current?.srcObject?.getTracks().forEach(t => t.stop())
    }, [])

    // 4) Bucle de reconocimiento automático cada 1 segundos
    useEffect(() => {
        if (!modelsLoaded || registered.length === 0 || reconocido) return

        const interval = setInterval(() => {
            capturarYComparar()
        }, 1000)

        return () => clearInterval(interval)
    }, [modelsLoaded, registered, reconocido])

    // 5) Función de captura y comparación
    const capturarYComparar = async () => {
        if (!videoRef.current) return

        const detection = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor()

        if (!detection) {
            console.log('No se detectó rostro')
            setMensaje("")
            return
        }

        const matches = registered.map(u => ({
            ...u,
            dist: euclideanDistance(u.descriptor, detection.descriptor)
        }))

        matches.sort((a, b) => a.dist - b.dist)

        const best = matches[0]
        const UMBRAL = 0.6



        if (best && best.dist < UMBRAL) {
            try {
                const { data } = await axios.post('http://localhost:3001/api/auth/login-facial', {
                    userId: best.id
                })

                const usuario = data.usuario
                const token = data.token

                if (!usuario || !token) {
                    return Swal.fire("Error", "Usuario reconocido, pero sin acceso válido", "error")
                }

                setMensaje("")
                console.log("Usuario reconocido:", usuario)

                login({ ...usuario, token })
                Swal.fire("¡Bienvenido!", `${usuario.nombre}`, "success")
                setReconocido(true)

                // Guardar token y usuario en localStorage
                localStorage.setItem('token', data.token)
                localStorage.setItem('usuario', JSON.stringify(data.usuario))

                if (usuario.id_rol === 1) {
                    navigate('/admin')
                } else {
                    navigate('/habitaciones')
                }

            } catch (err) {
                console.error("Error en login facial:", err)
                Swal.fire("Error", "Autenticación facial fallida", "error")
            }
        } else {
            console.log("Usuario no reconocido")
            setMensaje("Usuario desconocido")
        }

        // cerrar camara 
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        }

    }

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4 centered">Login Facial Automático</h2>
            <video ref={videoRef} autoPlay muted width="320" height="240" className="border content-center" />
            <p className="mt-2 text-sm text-red-400">{mensaje}</p>
            <p className="mt-2 text-sm text-gray-600">Detectando rostro automáticamente…</p>
        </div>
    )
}