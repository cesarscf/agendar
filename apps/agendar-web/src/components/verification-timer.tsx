import { Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VerificationTimerProps {
  expiresAt: Date
  onExpire?: () => void
}

export function VerificationTimer({
  expiresAt,
  onExpire,
}: VerificationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now()
      const expiry = expiresAt.getTime()
      const difference = expiry - now

      if (difference <= 0) {
        setTimeLeft(0)
        onExpire?.()
        return
      }

      setTimeLeft(Math.floor(difference / 1000))
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [expiresAt, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isExpired = timeLeft === 0
  const isExpiringSoon = timeLeft < 60 && timeLeft > 0

  return (
    <Alert
      variant={
        isExpired ? "destructive" : isExpiringSoon ? "default" : "default"
      }
    >
      <Clock className="h-4 w-4" />
      <AlertDescription>
        {isExpired ? (
          <span className="font-medium">Código expirado</span>
        ) : (
          <span>
            Código expira em:{" "}
            <span className="font-mono font-semibold">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </span>
          </span>
        )}
      </AlertDescription>
    </Alert>
  )
}
