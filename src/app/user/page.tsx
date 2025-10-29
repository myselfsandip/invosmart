import { redirect } from "next/navigation";

const UserRootPage = () => {
    redirect("/user/dashboard");
};

export default UserRootPage;
