export interface User {
    name: string,
    email: string,
    id: string,
    token?: string
    role: "admin" | "user"
}

export interface NavLink {
    route: string,
    text: string,
    buttonVariant?: string,
    buttonClasses?: string,
}

export interface Booking {
    date: string,
    startTime: string,
    endTime: string,
    isAvailable: boolean,
    bookings: Slot[]
}

export interface Slot {
    startTime: string,
    endTime: string,
    isAvailable: boolean,
    phoneNumber: string,
    email: string,
    customerName: string,
    serviceType: string
}