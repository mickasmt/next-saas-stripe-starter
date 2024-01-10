const ClerkLayout = ({
	children
} : {
	children: React.ReactNode
}) => {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			{children}
		</div>
	)
}

export default ClerkLayout