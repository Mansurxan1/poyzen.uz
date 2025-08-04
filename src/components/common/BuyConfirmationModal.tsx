import React from "react"
import { useTranslation } from "react-i18next"
import { Bell, Mail, CheckCircle, Pin } from "lucide-react"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"
import Separator from "@/components/ui/separator"

interface BuyConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const BuyConfirmationModal: React.FC<BuyConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Bell className="w-12 h-12 text-yellow-500" />
          </div>

          <h2 className="text-xl font-bold">{t("attention")}</h2>

          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                {t("telegram_redirect_message", "Sizni hozir Telegram botga yo'naltiramiz. Iltimos, bot ochilgach, 'Start' tugmasini bosing.")}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{t("confirm_order_message", "Bu tugma orqali sizning buyurtmangiz tasdiqlanadi.")}</p>
            </div>

            <div className="flex items-start gap-3">
              <Pin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t("important", "Muhim!")}</p>
                <p className="text-sm">{t("admin_contact_warning", "Agar siz 'Start' tugmasini bosmasangiz, admin siz bilan bog'lana olmaydi.")}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              {t("cancel", "Bekor qilish")}
            </Button>
            <Button onClick={onConfirm} className="flex-1 bg-green-500 hover:bg-green-600">
              {t("confirm", "Tasdiqlash")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default BuyConfirmationModal