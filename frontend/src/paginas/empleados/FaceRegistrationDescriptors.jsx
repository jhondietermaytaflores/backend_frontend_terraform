import React, { useRef, useState, useEffect } from 'react'
import * as faceapi from 'face-api.js'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function FaceRegistrationDescriptors({ usuario, onClose }) {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [modelsLoaded, setModelsLoaded] = useState(false)
    const [capturing, setCapturing] = useState(false)
    const CAPTURAS = 15

    const intervalRef = useRef(null)

    // cargar models
    useEffect(() => {
        /* const loadModels = async () => {


            

            const MODEL_URL = '/hotel-nutrias-frontend/models'
            console.log('Cargando modelos...')
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ])
            console.log('Modelos cargados')
            setModelsLoaded(true)
        } */

        const loadModels = async () => {
            console.log("Cargando modelos...");

            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
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

    // iniciar camara
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                videoRef.current.srcObject = stream
            })
            .catch(err => {
                console.error('Error cámara:', err)
                Swal.fire('Error', 'No se pudo acceder a la cámara', 'error')
                onClose()
            })
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop())
            }
            cancelAnimationFrame(intervalRef.current)
        }
    }, [])

    // dibujar detecciones en tiempo real
    /* const drawDetections = (detections) => {
        const canvas = canvasRef.current
        faceapi.matchDimensions(canvas, {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
        })
        const resized = faceapi.resizeResults(detections, {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
        })
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resized)
        faceapi.draw.drawFaceLandmarks(canvas, resized)
    } */
    useEffect(() => {
        const updateCanvas = async () => {
            if (videoRef.current && modelsLoaded) {
                const detections = await faceapi
                    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()

                const canvas = canvasRef.current
                faceapi.matchDimensions(canvas, {
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight
                })
                const resized = faceapi.resizeResults(detections, {
                    width: videoRef.current.videoWidth,
                    height: videoRef.current.videoHeight
                })

                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                faceapi.draw.drawDetections(canvas, resized)
                faceapi.draw.drawFaceLandmarks(canvas, resized)
            }

            intervalRef.current = requestAnimationFrame(updateCanvas)
        }

        if (modelsLoaded) updateCanvas()

        return () => cancelAnimationFrame(intervalRef.current)
    }, [modelsLoaded])


    // comenzar el registro de rostros
    const handleRegister = async () => {
        if (!modelsLoaded) return Swal.fire('Espera', 'Modelos cargando...', 'info')
        setCapturing(true)
        Swal.fire({ title: 'Capturando rostros...', didOpen: () => Swal.showLoading() })

        const descriptors = []
        let intentos = 0
        /* 
        for (let i = 0; i < CAPTURAS; i++) {
            console.log(`Captura ${i + 1}/${CAPTURAS}`)
                //const detection = await faceapi
                //.detectSingleFace(videoRef.current)
                //.withFaceLandmarks()
                //.withFaceDescriptor()

            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor()

            if (detection) {
                console.log('Detección válida:', detection)
                drawDetections(detection)
                descriptors.push(detection.descriptor)
            } else {
                console.warn('No se detectó rostro en la captura', i + 1)
            }
            await new Promise(r => setTimeout(r, 600))
        }
         */
        while (descriptors.length < CAPTURAS && intentos < CAPTURAS * 10) {
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor()

            if (detection && detection.descriptor) {
                console.log(`Captura ${descriptors.length + 1}/${CAPTURAS}`)
                descriptors.push(detection.descriptor)
            } else {
                console.log('Rostro no detectado, reintentando...')
            }

            intentos++
            await new Promise(r => setTimeout(r, 500)) // Esperar 500ms antes de siguiente intento
        }

        Swal.close()

        if (!descriptors.length) {
            Swal.fire('Error', 'No se capturaron rostros válidos', 'error')
            setCapturing(false)
            return
        }

        // Promediar
        /* const avg = descriptors[0].map((_, dim) =>
            descriptors.reduce((sum, desc) => sum + desc[dim], 0) / descriptors.length
        ) */

        // Promediar los descriptores, 
        const avg = descriptors[0].map((_, i) =>
            descriptors.reduce((sum, d) => sum + d[i], 0) / descriptors.length
        )

        // Slug
        const slug = usuario.nombre.trim().toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        try {
            console.log("Enviando descriptor promedio al backend...")
            await axios.post(`http://localhost:3001/api/usuarios/${usuario.id}/descriptor`,
                /* { descriptor: avg }) */
                { descriptor: Array.from(avg) })
                , {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            Swal.fire('¡Listo!', 'Descriptor guardado', 'success')
            console.log('Descriptor guardado exitosamente en la base de datos')
            onClose()
        } catch (err) {
            console.error('Error guardar descriptor:', err)
            Swal.fire('Error', 'No se pudo guardar descriptor', 'error')
        }
        setCapturing(false)

        // Detener la cámara después de completar el proceso
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop())
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Registrar rostro: {usuario.nombre}</h2>

                <div className="relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full rounded"
                        style={{ aspectRatio: '4/3', background: '#000' }}
                    />
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={300}
                        className="absolute top-0 left-0 w-full h-full"
                    />
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        disabled={capturing}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleRegister}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={capturing}
                    >
                        {capturing ? 'Capturando...' : 'Comenzar a registrar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
