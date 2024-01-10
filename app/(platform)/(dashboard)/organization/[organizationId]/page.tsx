import { OrganizationSwitcher, auth } from "@clerk/nextjs"

const OrganizationIdPage = () => {
	const { userId, orgId } = auth();
	return (
		<div>
			Organization ID: {orgId}
		</div>
	)
}

export default OrganizationIdPage;