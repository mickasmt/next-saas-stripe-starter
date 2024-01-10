import { dashboardConfig } from "@/config/dashboard"
import { NavBar } from "@/components/layout/navbar"
const DashboardLayout = ({
	children
} : {
	children: React.ReactNode
}) => {
	return (
		<div className="flex min-h-screen flex-col space-y-6">
      <NavBar items={dashboardConfig.mainNav} scroll={false} />
			{children}
		</div>
	)
}

export default DashboardLayout