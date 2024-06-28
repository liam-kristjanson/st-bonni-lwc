export interface User {
    name: string,
    email: string,
    id: string,
    authToken?: string
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
}

