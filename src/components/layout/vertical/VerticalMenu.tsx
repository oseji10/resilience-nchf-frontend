import { useEffect, useState } from "react";
import { Menu, SubMenu, MenuItem, MenuSection } from "@/@menu/vertical-menu"; // Adjust path as needed
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, MenuItem as MUIItem, Typography } from "@mui/material"; // For MUI styling of menu items
import Cookies from "js-cookie";
import useVerticalNav from "@/@menu/hooks/useVerticalNav";
import PerfectScrollbar from "react-perfect-scrollbar";
import menuItemStyles from "@/@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@/@core/styles/vertical/menuSectionStyles";
import StyledVerticalNavExpandIcon from "@/@menu/styles/vertical/StyledVerticalNavExpandIcon";

const VerticalMenu = ({ filteredMenu }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const theme = useTheme();
  const router = useRouter();

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const { isBreakpointReached, transitionDuration } = useVerticalNav();
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
          })}
    >
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => (
          <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
            <i className="ri-arrow-right-s-line" />
          </StyledVerticalNavExpandIcon>
        )}
        renderExpandedMenuItemIcon={{ icon: <i className="ri-circle-line" /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuSection label="Dashboard">
          {filteredMenu.map((item, index) => (
            <div key={index}>
              {item.subItems && item.subItems.length > 0 ? (
                <SubMenu
                  label={item.label}
                  icon={item.icon}
                  onClick={() => toggleSubmenu(index)}
                  open={openSubmenu === index}
                >
                  {openSubmenu === index &&
                    item.subItems.map((subItem, subIndex) => (
                      <MenuItem key={subIndex} component="a" href={subItem.href}>
                        {subItem.icon}
                        {subItem.label}
                      </MenuItem>
                    ))}
                </SubMenu>
              ) : (
                <MenuItem component="a" href={item.href}>
  <Box display="flex" alignItems="center" gap={1}>
    {item.icon}
    <Typography variant="body2">{item.label}</Typography>
  </Box>
</MenuItem>

              )}
            </div>
          ))}
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  );
};

const App = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = Cookies.get("role");

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/user-permissions?role=${role}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          
        });
        const data = await response.json();
        console.log(data);
        setPermissions(data.permissions); // Assuming API returns `{ permissions: ["view_patients", "manage_users"] }`
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchPermissions();
    }
  }, [role]);

  const menuItems = [
    {
      label: "Apply",
      icon: <i className="ri-pencil-fill" />,
      href: "/dashboard/apply/biodata",
      permission: "patient_apply",
    },
    {
      label: "Track Status",
      icon: <i className="ri-search-2-fill" />,
      href: "/dashboard/track-status",
      permission: "track_status",
    },
    {
      label: "Billings",
      icon: <i className="ri-shopping-bag-4-fill" />,
      href: "/dashboard/patient-billing-history",
      permission: "patient_billing_history",
    },
    // {
    //   label: "Patients",
    //   icon: <i className="ri-user-settings-line" />,
    //   permission: "view_patients",
    //   subItems: [
    //     { label: "All Patients", href: "/dashboard/patients" },
    //     { label: "New Patient", href: "/dashboard/patients/new-patient" },
    //   ],
    // },


// Super Admin

{
  label: "Patients",
  icon: <i className="ri-wheelchair-fill" />,
  href: "/dashboard/patients",
  permission: "view_all_hospitals",
},

    {
      label: "Hospitals",
      icon: <i className="ri-hospital-fill" />,
      href: "/dashboard/hospitals",
      permission: "view_all_hospitals",
    },

    {
      label: "Manage Users",
      icon: <i className="ri-group-fill" />,
      href: "/dashboard/users/hospital-admins",
      permission: "manage_hospital_admins",
    },


    {
      label: "Appointments",
      icon: <i className="ri-calendar-line" />,
      href: "/dashboard/appointments",
      permission: "manage_appointments",
    },



    // Hospital Admins
    {
      label: "Patients",
      icon: <i className="ri-wheelchair-fill" />,
      href: "/dashboard/patients",
      permission: "hospital_admin_manage_hospital_patients",
    },

    {
      label: "Billings",
      icon: <i className="ri-shopping-bag-4-fill" />,
      href: "/dashboard/patient-billing-history",
      permission: "hospital_admin_view_patients_billings",
    },

    {
      label: "Manage Users",
      icon: <i className="ri-group-fill" />,
      href: "/dashboard/users/hospital-staff",
      permission: "manage_hospital_staff",
    },

    // {
    //   label: "Users",
    //   icon: <i className="ri-group-fill" />,
    //   permission: "super_admin_create_new_user",
    //   href: "/dashboard/users",
    //   subItems: [
    //     { label: "Hospital Admins", href: "/dashboard/users/hospital-admins", permission: "manage_hospital_admins" },
    //     { label: "CMDs", href: "/dashboard/users/cmds", permission: "manage_cmds" },
    //     { label: "Other Users", href: "/dashboard/users", permission: "manage_other_users" },
    //   ],
    // },

    

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
        { label: "Medicines", href: "/dashboard/inventories/medicines" },
        { label: "Lenses", href: "/dashboard/inventories/lenses" },
        { label: "Frames", href: "/dashboard/inventories/frames" },
        { label: "Accessories", href: "/dashboard/inventories/accessories" },
      ],
    },
  ];

  const hasPermission = (permissionSlug) => !permissionSlug || permissions.includes(permissionSlug);

  const filteredMenu = menuItems
    .filter((item) => hasPermission(item.permission))
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter((subItem) => hasPermission(subItem.permission)) || [],
    }));

  if (loading) return <Typography>
  <Box display="flex" justifyContent="center" alignItems="center">
    <CircularProgress size={20} />
  </Box>
</Typography>;;

  return (
    <div>
      <VerticalMenu filteredMenu={filteredMenu} />
    </div>
  );
};

export default App;
