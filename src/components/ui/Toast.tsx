import type React from "react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { removeToast, type Toast as ToastType } from "@/features/toastSlice"
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from "react-icons/fi"

interface ToastProps {
  toast: ToastType
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id))
    }, toast.duration || 3000) // Default duration 3 seconds

    return () => clearTimeout(timer)
  }, [dispatch, toast.id, toast.duration])

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <FiCheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <FiXCircle className="w-5 h-5 text-red-500" />
      case "info":
        return <FiInfo className="w-5 h-5 text-blue-500" />
      case "warning":
        return <FiAlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getClasses = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border ${getClasses()} transition-all duration-300 ease-out transform translate-x-0 opacity-100`}
      role="alert"
    >
      {getIcon()}
      <span className="text-sm font-medium text-gray-800">{toast.message}</span>
      <button onClick={() => dispatch(removeToast(toast.id))} className="ml-auto p-1 rounded-full hover:bg-gray-100">
        <FiXCircle className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
}

export default Toast
