import { ClerkProvider } from '@clerk/nextjs'
const PlatformLayout = ({
	children
} : {
	children: React.ReactNode
}) => {
	return (
		<ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}>
			{children}
		</ClerkProvider>
	)
}

export default PlatformLayout