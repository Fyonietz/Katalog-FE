 // components/layout/AdminSidebar.tsx
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { sidebarItems, type SidebarItem } from "../../config/adminSidebar";
import { cn } from "../../lib/utils";

function SidebarLink({ item, nested = false }: { item: SidebarItem; nested?: boolean }) {
  return (
    <NavLink
      to={item.path!}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          nested && "pl-9",
          isActive
            ? "bg-[#1B2A6B] text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-[#1B2A6B]"
        )
      }
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  );
}

function SidebarGroup({ item }: { item: SidebarItem }) {
  const location = useLocation();
  const hasActiveChild = item.children?.some((c) => c.path === location.pathname);
  const [open, setOpen] = useState(!!hasActiveChild);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          hasActiveChild ? "text-[#1B2A6B]" : "text-gray-500 hover:bg-gray-100 hover:text-[#1B2A6B]"
        )}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarLink key={child.path} item={child} nested />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B2A6B] text-sm font-bold text-white">
          N
        </div>
        <span className="font-semibold text-[#1B2A6B]">NM Printing</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {sidebarItems.map((item) =>
          item.children ? (
            <SidebarGroup key={item.label} item={item} />
          ) : (
            <SidebarLink key={item.path} item={item} />
          )
        )}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500
                     transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
