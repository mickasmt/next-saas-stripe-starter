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
  {
    id: "8",
    name: "Noah Petit",
    email: "noah.petit@example.com",
    role: "user",
    banned: false,
    joined: "Aug 13, 2026",
  },
  {
    id: "9",
    name: "Mia Garcia",
    email: "mia.garcia@example.com",
    role: "user",
    banned: false,
    joined: "Aug 12, 2026",
  },
  {
    id: "10",
    name: "Liam Moreau",
    email: "liam.moreau@example.com",
    role: "user",
    banned: false,
    joined: "Aug 11, 2026",
  },
  {
    id: "11",
    name: "Ava Thompson",
    email: "ava.thompson@example.com",
    role: "user",
    banned: true,
    joined: "Aug 10, 2026",
  },
  {
    id: "12",
    name: "Ethan Roux",
    email: "ethan.roux@example.com",
    role: "user",
    banned: false,
    joined: "Aug 9, 2026",
  },
  {
    id: "13",
    name: "Chloe Brown",
    email: "chloe.brown@example.com",
    role: "user",
    banned: false,
    joined: "Aug 8, 2026",
  },
  {
    id: "14",
    name: "Leo Fontaine",
    email: "leo.fontaine@example.com",
    role: "user",
    banned: false,
    joined: "Aug 7, 2026",
  },
  {
    id: "15",
    name: "Zoe Anderson",
    email: "zoe.anderson@example.com",
    role: "user",
    banned: false,
    joined: "Aug 6, 2026",
  },
]
