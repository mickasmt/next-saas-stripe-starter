import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type Modal = {
  signInOpen: boolean
}

const modalAtom = atomWithStorage<Modal>("modal", {
  signInOpen: false,
})

export function useModal() {
  return useAtom(modalAtom)
}