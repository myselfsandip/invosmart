import DashboardLayout from "@/components/layouts/DashboardLayout";

const layout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {



    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    )
}



export default layout;