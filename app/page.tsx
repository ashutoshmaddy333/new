"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Heart, Stars, Sparkles, Music, Gift, Camera, PartyPopper } from "lucide-react"
import { GiftIcon, CakeIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import { Tilt } from "react-tilt"
import { useInView } from "react-intersection-observer"

// Birthday wishes for Nandu
const birthdayWishes = [
  "Happy Birthday to the most amazing friend! Your smile lights up every room you enter. May your day be filled with joy and laughter!",
  "To my dearest Nandu, may this birthday bring you as much happiness as you bring to everyone around you. You deserve all the best!",
  "Wishing you a day filled with beautiful moments and a year filled with success. Happy Birthday, Nandu!",
  "On your special day, I want you to know how much you mean to me. Your friendship is a gift I treasure every day. Happy Birthday!",
  "May your birthday be the start of a year filled with good luck, good health, and much happiness. Enjoy your special day!",
  "Sending birthday wishes wrapped with all my love to the most wonderful friend. May all your dreams come true!",
  "Happy Birthday to someone who makes life more beautiful just by being in it. Thank you for being you, Nandu!",
  "Another year older, another year wiser, and another year of being an amazing friend. Happy Birthday, Nandu!",
  "May your birthday be as sweet as the cake and filled with wonderful surprises. You deserve nothing but the best!",
  "Cheers to another trip around the sun! May this year bring you endless opportunities and beautiful moments. Happy Birthday!",
  "To a friend who is always there through thick and thin. May your birthday be as special as you are to me!",
  "Wishing you a spectacular birthday filled with everything that makes you happiest. You deserve it all!",
]

// Photo captions - added 2 more for a total of 12
const photoCaptions = [
  "The day we first met - an unforgettable memory!",
  "Your smile always brightens my day!",
  "Remember this adventure? One of our best days!",
  "That time we couldn't stop laughing!",
  "Your birthday celebration last year - let's make this one even better!",
  "Friends who travel together, stay together!",
  "That perfect sunset we witnessed together",
  "Your graduation day - so proud of you!",
  "Our coffee dates are always the highlight of my week",
  "Just being silly - these are the moments I cherish most",
  "That amazing trip we took last summer - unforgettable!",
  "Your dance moves always make everyone smile!",
]

export default function NanduBirthdayGreeting() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const { width, height } = useWindowSize()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const controls = useAnimation()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const totalImages = 12 // Updated to 12 images

  // Calculate days until next birthday
  const today = new Date()
  const nextBirthday = new Date(today.getFullYear(), 6, 15) // July 15th (adjust month as needed, 0-indexed)
  if (today > nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Scroll to reveal animation
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Preload images
  useEffect(() => {
    console.log("Starting to preload images from /images/ directory")
    let loadedCount = 0
    const imagePromises = []

    for (let i = 1; i <= totalImages; i++) {
      const promise = new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = `/images/${i}.jpg`
        img.onload = () => {
          loadedCount++
          setLoadingProgress(Math.floor((loadedCount / totalImages) * 100))
          resolve()
        }
        img.onerror = (e) => {
          console.error(`Failed to load image ${i}.jpg:`, e)
          loadedCount++
          setLoadingProgress(Math.floor((loadedCount / totalImages) * 100))
          resolve() // Resolve even on error to continue loading
        }
      })
      imagePromises.push(promise)
    }

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true)
    })
  }, [])

  useEffect(() => {
    // Start background animations
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
    })

    // Preload audio
    audioRef.current = new Audio("/main.mp3") // Make sure this file exists in your public folder
    audioRef.current.loop = true
    audioRef.current.volume = 0.4

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = "/main.mp3"
      }
    }
  }, [controls])

  const handlePlayMusic = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }

    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleSpecialButton = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % totalImages)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }

  const toggleFullscreen = (index: number) => {
    setCurrentPhotoIndex(index)
    setIsFullscreen(!isFullscreen)
  }

  // Loading screen
  if (!imagesLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CakeIcon className="h-24 w-24 text-pink-600 mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl font-bold text-purple-900 mb-4">Preparing Nandu's Birthday Surprise</h1>
          <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500"
              style={{ width: `${loadingProgress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-4 text-purple-800 font-medium">{loadingProgress}% loaded</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.05} />}

      {/* Hero Section with Parallax Effect */}
      <motion.div
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Blobs */}
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute -bottom-32 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          animate={{
            x: [0, 50, -20, 0],
            y: [0, -20, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />

        {/* Floating Elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            initial={{
              x: Math.random() * width,
              y: Math.random() * height,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: [Math.random() * height, Math.random() * height - 100, Math.random() * height],
              rotate: [0, Math.random() * 360, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            {i % 5 === 0 ? (
              <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
            ) : i % 5 === 1 ? (
              <Stars className="h-6 w-6 text-yellow-400" />
            ) : i % 5 === 2 ? (
              <Sparkles className="h-6 w-6 text-blue-400" />
            ) : i % 5 === 3 ? (
              <CakeIcon className="h-6 w-6 text-purple-500" />
            ) : (
              <GiftIcon className="h-6 w-6 text-red-400" />
            )}
          </motion.div>
        ))}

        {/* Main Title with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
          className="text-center mb-8 relative z-10"
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold relative"
              animate={{
                textShadow: [
                  "0 0 5px rgba(236, 72, 153, 0.3)",
                  "0 0 15px rgba(236, 72, 153, 0.5)",
                  "0 0 5px rgba(236, 72, 153, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-transparent bg-clip-text animate-gradient-text">
                Happy Birthday
              </span>
            </motion.h1>

            {/* Decorative elements around the title */}
            <motion.div
              className="absolute -top-8 -left-8"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              <PartyPopper className="h-8 w-8 text-yellow-500" />
            </motion.div>

            <motion.div
              className="absolute -top-8 -right-8"
              animate={{
                rotate: [0, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            >
              <PartyPopper className="h-8 w-8 text-pink-500" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.h2
              className="text-3xl md:text-5xl mt-6 font-medium text-purple-800 font-dancing"
              animate={{
                y: [0, -10, 0],
                textShadow: [
                  "0 0 0px rgba(107, 33, 168, 0)",
                  "0 0 10px rgba(107, 33, 168, 0.5)",
                  "0 0 0px rgba(107, 33, 168, 0)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              ~ My Dearest Nandu ~
            </motion.h2>
          </motion.div>

          {/* Birthday Countdown */}

          {/* Animated Hearts Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex justify-center gap-3 my-8"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
                className="relative"
              >
                <Heart
                  className={`h-8 w-8 ${i % 2 === 0 ? "text-pink-500 fill-pink-500" : "text-purple-500 fill-purple-500"}`}
                />
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: i * 0.2 + 1,
                  }}
                >
                  <Heart
                    className={`h-8 w-8 ${i % 2 === 0 ? "text-pink-500 fill-pink-500" : "text-purple-500 fill-purple-500"}`}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated Cake Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 1.5,
            }}
            className="my-8 relative"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  filter: [
                    "drop-shadow(0 0 5px rgba(236, 72, 153, 0.3))",
                    "drop-shadow(0 0 15px rgba(236, 72, 153, 0.7))",
                    "drop-shadow(0 0 5px rgba(236, 72, 153, 0.3))",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
              >
                <CakeIcon className="h-24 w-24 text-pink-500" />
              </motion.div>

              <motion.div
                animate={{ y: [-10, 0, -10] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: -20 - i * 5,
                      x: (i % 2 === 0 ? 5 : -5) * i,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                    }}
                    className="absolute left-1/2 transform -translate-x-1/2"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400 animate-sparkle" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <p className="text-purple-800 font-medium mb-2 text-lg">Scroll Down for Nandu's Gallery</p>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-purple-800"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Nandu's Photo Gallery */}
      <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-purple-100">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-purple-800 mb-4">
            <span className="relative inline-block">
              Nandu's Gallery
              <motion.span
                className="absolute -top-6 -right-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Camera className="h-8 w-8 text-pink-500" />
              </motion.span>
            </span>
          </h2>
          <p className="text-xl text-purple-600 max-w-2xl mx-auto">
            Celebrating the beautiful moments of our amazing Nandu on her special day!
          </p>
        </motion.div>

        {/* Featured Photo with Wish */}
        <div className="max-w-5xl mx-auto mb-20">
          <Tilt options={{ max: 10, scale: 1.03, perspective: 1000, glare: true, "max-glare": 0.5 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl card-3d"
            >
              <img
                src={`/images/${currentPhotoIndex + 1}.jpg`}
                alt={`Nandu featured photo ${currentPhotoIndex + 1}`}
                className="w-full h-[70vh] object-cover card-3d-content"
                onError={(e) => {
                  console.error(`Failed to load featured image ${currentPhotoIndex + 1}.jpg`)
                  e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12"
                whileHover={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="card-3d-content"
                >
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 font-dancing">Beautiful Nandu</h3>
                  <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
                    {birthdayWishes[currentPhotoIndex % birthdayWishes.length]}
                  </p>
                  <p className="text-lg text-white/80 mt-4 italic">{photoCaptions[currentPhotoIndex]}</p>
                </motion.div>
              </motion.div>

              {/* Navigation Controls */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevPhoto}
                  className="bg-white/30 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/50 transition-all shadow-lg"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextPhoto}
                  className="bg-white/30 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/50 transition-all shadow-lg"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </motion.button>
              </div>
            </motion.div>
          </Tilt>
        </div>

        {/* Photo Grid - Updated to show all 12 images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
          {[...Array(totalImages)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ scale: 1.05, zIndex: 10, y: -5 }}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group"
              onClick={() => toggleFullscreen(i)}
            >
              <img
                src={`/images/${i + 1}.jpg`}
                alt={`Nandu photo ${i + 1}`}
                className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  console.error(`Failed to load grid image ${i + 1}.jpg`)
                  e.currentTarget.src = "/placeholder.svg?height=300&width=300"
                }}
              />
              <motion.div
                initial={{ opacity: 0 }} //THIS U=IFJF
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4"
              >
                <p className="text-white font-medium">{photoCaptions[i]}</p>
              </motion.div>

              {/* Decorative corner element */}
              <motion.div
                className="absolute top-2 right-2 bg-white/30 backdrop-blur-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.2, rotate: 45 }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Music Controls */}
        <div className="flex justify-center mt-16">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
            <Button
              onClick={handlePlayMusic}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-6 rounded-full text-lg shadow-xl flex items-center gap-3 relative overflow-hidden"
            >
              <Music className="h-6 w-6" />
              {isPlaying ? "Pause Birthday Music" : "Play Birthday Music"}

              {/* Animated ripple effect */}
              {isPlaying && (
                <>
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.5, 0.3, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.5, 0.3, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 0.5,
                    }}
                  />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Birthday Wishes Section */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-purple-800 mb-4">Birthday Wishes for Nandu</h2>
            <p className="text-xl text-purple-600 max-w-2xl mx-auto">Special messages for a special person</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {birthdayWishes.slice(0, 6).map((wish, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10, y: -5 }}
                className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-xl relative overflow-hidden border border-white/50"
              >
                <div
                  className={`absolute -right-4 -top-4 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${
                    i % 3 === 0 ? "bg-pink-300" : i % 3 === 1 ? "bg-purple-300" : "bg-blue-300"
                  }`}
                ></div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    {i % 3 === 0 ? (
                      <Heart className="h-12 w-12 text-pink-500 fill-pink-500 filter-drop-shadow-glow" />
                    ) : i % 3 === 1 ? (
                      <Stars className="h-12 w-12 text-yellow-500 filter-drop-shadow-glow" />
                    ) : (
                      <Sparkles className="h-12 w-12 text-blue-500 filter-drop-shadow-glow" />
                    )}
                  </div>
                  <p className="text-lg text-center text-gray-700 font-medium leading-relaxed">{wish}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Final Birthday Message */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-purple-200"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <CakeIcon className="h-24 w-24 text-pink-500 mx-auto animate-pulse-glow" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-purple-800 mb-8 font-dancing"
          >
            Happy Birthday, Nandu!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-purple-700 mb-12"
          >
            May your day be as special as you are to me. Here's to many more years of friendship and memories!
          </motion.p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Button
              onClick={handleSpecialButton}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-10 py-8 rounded-full text-xl shadow-2xl relative overflow-hidden"
            >
              <Gift className="mr-3 h-6 w-6" /> Celebrate Nandu!
              {/* Sparkle effects */}
              <motion.span
                className="absolute top-1 right-2"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                  rotate: [0, 15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.span>
              <motion.span
                className="absolute bottom-2 left-3"
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                  rotate: [0, -15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.5,
                }}
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/images/${currentPhotoIndex + 1}.jpg`}
                alt={`Nandu fullscreen photo ${currentPhotoIndex + 1}`}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  console.error(`Failed to load fullscreen image ${currentPhotoIndex + 1}.jpg`)
                  e.currentTarget.src = "/placeholder.svg?height=600&width=800"
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/40 transition-all"
              >
                <XIcon className="h-6 w-6" />
              </motion.button>

              {/* Navigation buttons */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 -translate-y-1/2 pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    prevPhoto()
                  }}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/40 transition-all pointer-events-auto"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    nextPhoto()
                  }}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/40 transition-all pointer-events-auto"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 left-0 right-0 text-center"
              >
                <div className="bg-black/50 backdrop-blur-md py-4 px-6 rounded-2xl inline-block max-w-2xl mx-auto">
                  <p className="text-white text-lg font-medium mb-2">{photoCaptions[currentPhotoIndex]}</p>
                  <p className="text-white/80 text-sm italic">
                    {birthdayWishes[currentPhotoIndex % birthdayWishes.length]}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animation Elements */}
      <motion.div
        className="fixed bottom-0 left-0 w-full h-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0"
            initial={{
              x: `${Math.random() * 100}%`,
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: -100 - Math.random() * 100,
              opacity: [0, 1, 0],
              x: `${Math.random() * 100}%`,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          >
            {i % 5 === 0 ? (
              <Heart
                className={`h-${Math.floor(Math.random() * 3) + 4} w-${Math.floor(Math.random() * 3) + 4} fill-pink-${Math.floor(Math.random() * 3) * 100 + 300}`}
              />
            ) : i % 5 === 1 ? (
              <Stars
                className={`h-${Math.floor(Math.random() * 3) + 4} w-${Math.floor(Math.random() * 3) + 4} text-yellow-${Math.floor(Math.random() * 3) * 100 + 300}`}
              />
            ) : i % 5 === 2 ? (
              <Sparkles
                className={`h-${Math.floor(Math.random() * 3) + 4} w-${Math.floor(Math.random() * 3) + 4} text-blue-${Math.floor(Math.random() * 3) * 100 + 300}`}
              />
            ) : i % 5 === 3 ? (
              <CakeIcon
                className={`h-${Math.floor(Math.random() * 3) + 4} w-${Math.floor(Math.random() * 3) + 4} text-purple-${Math.floor(Math.random() * 3) * 100 + 300}`}
              />
            ) : (
              <GiftIcon
                className={`h-${Math.floor(Math.random() * 3) + 4} w-${Math.floor(Math.random() * 3) + 4} text-red-${Math.floor(Math.random() * 3) * 100 + 300}`}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
