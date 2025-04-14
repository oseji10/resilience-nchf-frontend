import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { Menu } from "@mui/material";
import { MenuItem, SubMenu } from "@/@menu/vertical-menu";

const VerticalMenu = ({ scrollMenu }) => {
  const router = useRouter();
  const [permissions, setPermissions] = useState([]);

  const menuItems = [
    {
      label: "Dashboard",
      icon: <i className="ri-dashboard-line" />,
      href: "/dashboard",
      permission: null, // No permission needed (visible to all)
    },
    {
      label: "Patients",
      icon: <i className="ri-user-settings-line" />,
      permission: "view_patients", // Controlled by permissions
      subItems: [
        {
          label: "All Patients",
          href: "/dashboard/patients",
          permission: "view_patients",
        },
        {
          label: "Encounters",
          href: "/dashboard/encounters",
          permission: "manage_appointments",
        },
      ],
    },
    {
      label: "Appointments",
      icon: <i className="ri-calendar-line" />,
      href: "/dashboard/appointments",
      permission: "manage_appointments",
    },
    {
      label: "Users",
      icon: <i className="ri-group-line" />,
      permission: "manage_users",
      subItems: [
        {
          label: "New User",
          href: "/dashboard/users/new-user",
          permission: "manage_users",
        },
        {
          label: "All Users",
          href: "/dashboard/users",
          permission: "manage_users",
        },
      ],
    },
    {
      label: "Billings",
      icon: <i className="ri-shopping-cart-line" />,
      href: "/dashboard/billings",
      permission: "view_billings",
    },
    {
      label: "Inventory",
      icon: <i className="ri-stock-line" />,
      permission: "access_inventory",
      subItems: [
        {
          label: "Medicines",
          href: "/dashboard/inventories/medicines",
          permission: "access_inventory",
        },
        {
          label: "Lenses",
          href: "/dashboard/inventories/lenses",
          permission: "access_inventory",
        },
        {
          label: "Frames",
          href: "/dashboard/inventories/frames",
          permission: "access_inventory",
        },
        {
          label: "Accessories",
          href: "/dashboard/inventories/accessories",
          permission: "access_inventory",
        },
      ],
    },
  ];
  
  // Get role from cookies
  const role = Cookies.get("role");

  useEffect(() => {
    if (!Cookies.get("authToken")) {
      router.push("/login");
      return;
    }

    // Fetch permissions for the role
    // const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`)
    axios
      .get(`${process.env.NEXT_PUBLIC_APP_URL}/user-permissions?role=${role}`)
      .then((response) => {
        setPermissions(response.data.permissions);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
      });
  }, [role]);

  // Function to check if a user has permission
  const hasPermission = (permissionSlug) => {
    return !permissionSlug || permissions.includes(permissionSlug);
  };

  // Filter menu based on permissions
  const filteredMenu = menuItems.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <Menu>
      {filteredMenu.map((item, index) => (
        <div key={index}>
          {item.subItems ? (
            <SubMenu label={item.label} icon={item.icon}>
              {item.subItems
                .filter((subItem) => hasPermission(subItem.permission))
                .map((subItem, subIndex) => (
                  <MenuItem key={subIndex} href={subItem.href}>
                    {subItem.label}
                  </MenuItem>
                ))}
            </SubMenu>
          ) : (
            <MenuItem href={item.href} icon={item.icon}>
              {item.label}
            </MenuItem>
          )}
        </div>
      ))}
    </Menu>
  );
};

export default VerticalMenu;
