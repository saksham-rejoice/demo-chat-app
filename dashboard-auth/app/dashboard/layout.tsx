import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";
import SideBar from "@/components/dashboard/SideBar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}