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
    startTime: Date,
    endTime: Date,
    isAvailable: boolean,
    bookings: Slot[]
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

export interface Slot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    customerName?: string;
    phoneNumber?: string;
    email?: string;
    serviceType?: string;
  }

 export interface DayData {
    date: string;
    bookings: Slot[];
  }
