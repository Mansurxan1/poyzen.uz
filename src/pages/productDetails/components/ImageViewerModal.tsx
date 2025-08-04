"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { X, Plus, Minus } from "lucide-react"
import Button  from "@/components/ui/button"

interface ImageViewerModalProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ src, alt, isOpen, onClose }) => {
  const [scale, setScale] = useState(1)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const lastPosition = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const maxScale = 5
  const minScale = 1
  const zoomStep = 0.2

  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setTranslateX(0)
      setTranslateY(0)
      document.body.style.overflow = "hidden" // Orqadagi sahifani aylantirishni to'xtatadi
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleZoom = useCallback((amount: number) => {
    setScale((prevScale) => {
      const newScale = Math.max(minScale, Math.min(maxScale, prevScale + amount))
      return newScale
    })
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      handleZoom(e.deltaY < 0 ? zoomStep : -zoomStep)
    },
    [handleZoom],
  )

  useEffect(() => {
    const container = containerRef.current
    if (container && isOpen) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [isOpen, handleWheel])

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (scale > 1) {
        // Faqat kattalashtirilgan bo'lsa harakatlantirishga ruxsat beradi
        setIsDragging(true)
        lastPosition.current = { x: clientX, y: clientY }
      }
    },
    [scale],
  )

  const doDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return
      const dx = clientX - lastPosition.current.x
      const dy = clientY - lastPosition.current.y
      setTranslateX((prev) => prev + dx)
      setTranslateY((prev) => prev + dy)
      lastPosition.current = { x: clientX, y: clientY }
    },
    [isDragging],
  )

  const endDrag = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => startDrag(e.clientX, e.clientY), [startDrag])
  const handleMouseMove = useCallback((e: React.MouseEvent) => doDrag(e.clientX, e.clientY), [doDrag])
  const handleMouseUp = useCallback(endDrag, [endDrag])
  const handleMouseLeave = useCallback(endDrag, [endDrag]) // Sichqoncha konteynerdan chiqsa harakatlantirishni to'xtatadi

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        // Bir barmoq bilan harakatlantirish
        startDrag(e.touches[0].clientX, e.touches[0].clientY)
      }
      // Ikki barmoq bilan kattalashtirish (pinch-zoom) uchun qo'shimcha logika kerak bo'ladi
    },
    [startDrag],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        doDrag(e.touches[0].clientX, e.touches[0].clientY)
      }
      // Ikki barmoq bilan kattalashtirish (pinch-zoom) uchun qo'shimcha logika kerak bo'ladi
    },
    [doDrag],
  )

  const handleTouchEnd = useCallback(endDrag, [endDrag])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-90 flex items-center justify-center p-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
        aria-label="Rasmni ko'rish oynasini yopish"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleZoom(-zoomStep)}
          disabled={scale <= minScale}
          className="bg-white/80 hover:bg-white"
        >
          <Minus className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => handleZoom(zoomStep)}
          disabled={scale >= maxScale}
          className="bg-white/80 hover:bg-white"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-full max-w-screen-lg max-h-screen-lg flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging && scale > 1 ? "grabbing" : scale > 1 ? "grab" : "default" }}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="max-w-full max-h-full object-contain select-none" // Brauzerning rasm harakatlantirishini oldini oladi
          style={{
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: "center center", // Markazdan kattalashtirish
            transition: isDragging ? "none" : "transform 0.1s ease-out", // Harakatlantirilmayotganda silliq o'tish
          }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg" // Xato bo'lsa zaxira rasm
          }}
        />
      </div>
    </div>
  )
}

export default ImageViewerModal
