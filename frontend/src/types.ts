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
    bookings: Appointment[],
    isAvailable: boolean,
}

export interface Appointment {
    customerName: string,
    phoneNumber: string,
    address: string,
    email: string,
    serviceType: string,
    bookingTime: Date,
    duration: number,
    isCompleted: boolean,
}