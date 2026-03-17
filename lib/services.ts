export const SERVICES = [
  // Full Sets
  { id: 'short-set',    name: 'Short Acrylic Set',     category: 'Full Set', price: 55,  duration: 150 },
  { id: 'medium-set',   name: 'Medium Acrylic Set',    category: 'Full Set', price: 65,  duration: 150 },
  { id: 'long-set',     name: 'Long Acrylic Set',      category: 'Full Set', price: 75,  duration: 150 },
  { id: 'xl-set',       name: 'XL Acrylic Set',        category: 'Full Set', price: 85,  duration: 200 },
  { id: 'freestyle',    name: 'Freestyle Full Set',    category: 'Full Set', price: 70,  duration: 200 },
  // Refills
  { id: 'short-refill', name: 'Short Acrylic Refill',  category: 'Refill',   price: 45,  duration: 120 },
  { id: 'medium-refill',name: 'Medium Acrylic Refill', category: 'Refill',   price: 55,  duration: 120 },
  { id: 'long-refill',  name: 'Long Acrylic Refill',   category: 'Refill',   price: 65,  duration: 120 },
  { id: 'xl-refill',    name: 'XL Acrylic Refill',     category: 'Refill',   price: 75,  duration: 150 },
  // Removal
  { id: 'soak-off',     name: 'Soak Off',              category: 'Removal',  price: 15,  duration: 40  },
]

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

export function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2,'0')} ${ampm}`
}
