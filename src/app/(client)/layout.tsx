import Navbar from "@/components/navbar";
import SideMenu from "@/components/sideMenu";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-row h-screen">
        <SideMenu />
        <div className="ml-[200px] pt-[62px] h-full overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </>
  );
}
