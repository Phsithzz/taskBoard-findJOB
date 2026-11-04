package auth

import (
	"os"
	"sync"
	"time"
)

type PinManager struct {
	mu          sync.Mutex
	attempts    map[string]int
	lockedUntil map[string]time.Time
	targetPin   string
}

func NewPinManager() *PinManager {
	pin := os.Getenv("PERSONAL_PIN")
	if pin == "" {
		pin = "phoosithpheanchobMmorpg1234"
	}
	return &PinManager{
		attempts:    make(map[string]int),
		lockedUntil: make(map[string]time.Time),
		targetPin:   pin,
	}
}

func (m *PinManager) Verify(ip, pin string) (bool, int, int, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()
	if lockTime, exists := m.lockedUntil[ip]; exists {
		if now.Before(lockTime) {
			remainingMin := int(lockTime.Sub(now).Minutes()) + 1
			return false, 0, remainingMin, true
		}
		delete(m.lockedUntil, ip)
		delete(m.attempts, ip)
	}

	if pin == m.targetPin {
		delete(m.attempts, ip)
		return true, 3, 0, false
	}

	m.attempts[ip]++
	if m.attempts[ip] >= 3 {
		m.lockedUntil[ip] = now.Add(1 * time.Hour)
		delete(m.attempts, ip)
		return false, 0, 60, true
	}

	attemptsLeft := 3 - m.attempts[ip]
	return false, attemptsLeft, 0, false
}

func (m *PinManager) CheckLockout(ip string) (bool, int) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()
	if lockTime, exists := m.lockedUntil[ip]; exists {
		if now.Before(lockTime) {
			remainingMin := int(lockTime.Sub(now).Minutes()) + 1
			return true, remainingMin
		}
		delete(m.lockedUntil, ip)
		delete(m.attempts, ip)
	}
	return false, 0
}
