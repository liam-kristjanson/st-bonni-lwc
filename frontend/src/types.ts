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

export interface Review {
    serviceDate: string,
    customerEmail: string,
    customerName: string,
    comment: string,
    isSubmitted: boolean,
    rating: number,
    submittedDate: string
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

