import type React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux"
import Toast from "./Toast"

const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts)

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer
