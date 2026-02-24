import { DashboarLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboarLayout>
            {children}
        </DashboarLayout>
    )
}

export default Layout