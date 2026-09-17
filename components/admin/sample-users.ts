// Fictional accounts: the free admin panel never reads real users.
export type SampleUser = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  banned: boolean
  joined: string
}

export const sampleUsers: SampleUser[] = [
  {
    id: "1",
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    role: "admin",
    banned: false,
    joined: "Sep 12, 2026",
  },
  {
    id: "2",
    name: "Jackson Lee",
    email: "jackson.lee@example.com",
    role: "user",
    banned: false,
    joined: "Sep 10, 2026",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    email: "isabella.nguyen@example.com",
    role: "user",
    banned: false,
    joined: "Sep 8, 2026",
  },
  {
    id: "4",
    name: "William Kim",
    email: "will.kim@example.com",
    role: "user",
    banned: true,
    joined: "Sep 5, 2026",
  },
  {
    id: "5",
    name: "Sofia Davis",
    email: "sofia.davis@example.com",
    role: "admin",
    banned: false,
    joined: "Aug 29, 2026",
  },
  {
    id: "6",
    name: "Lucas Bernard",
    email: "lucas.bernard@example.com",
    role: "user",
    banned: false,
    joined: "Aug 21, 2026",
  },
  {
    id: "7",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    role: "user",
    banned: false,
    joined: "Aug 14, 2026",
  },
]
