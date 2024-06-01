import Head from "next/head";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Toast from "../../components/toast/toast";
import "../../styles/global.css";
import {UserProvider} from "./userContext";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/ccl.ico" />
      </Head>
      <body>
        <UserProvider>
        <Toast/>
          <main className="text-[#0e1726]">
            <DashboardLayout children={children} />
          </main>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
