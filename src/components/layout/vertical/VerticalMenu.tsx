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
  // const ScrollWrapper = isBreakpointReached && window.innerWidth <= 768 ? "div" : PerfectScrollbar;

  const token = Cookies.get("authToken");

  if (!token || token === "null" || token === "undefined") {
    window.location.href = "/login";  // Proper redirection
  }
  
  
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
//                 <MenuItem 
//                 component="a" href={item.href}>
//   <Box display="flex" alignItems="center" gap={1}>
//     {item.icon}
//     <Typography variant="body2">{item.label}</Typography>
//   </Box>
// </MenuItem>
<MenuItem
                    component="button"
                    onClick={() =>
                      item.modal ? setModalOpen(true) : router.push(item.href)
                    }
                  >
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
      label: "Dashboard",
      icon: <i className="ri-dashboard-fill" />,
      href: "/dashboard",
      
    },
    {
      label: "Apply",
      icon: <i className="ri-pencil-fill" />,
      href: "/dashboard/apply/biodata",
      permission: "patient_apply",
    },
    {
      label: "Track Status",
      icon: <i className="ri-search-2-fill" />,
      href: "/dashboard/apply/track-status",
      permission: "track_status",
    },
    {
      label: "Billings",
      icon: <i className="ri-shopping-bag-4-fill" />,
      href: "/dashboard/users/patient/billings",
      permission: "patient_billing_history",
    },

// Doctor Roles
    {
      label: "My Patients",
      icon: <i className="ri-group-fill" />,
      href: "/dashboard/users/doctor/patients",
      permission: "doctor_manage_patients",
    },
    {
      label: "Pending Patients",
      icon: <i className="ri-hourglass-fill" />,
      href: "/dashboard/users/doctor/pending",
      permission: "doctor_manage_patients",
    },
    {
      label: "Reviewed Patients",
      icon: <i className="ri-check-fill" />,
      href: "/dashboard/users/doctor/reviewed",
      permission: "doctor_manage_patients",
    },

    {
      label: "Rejected Patients",
      icon: <i className="ri-user-unfollow-fill" />,
      href: "/dashboard/users/doctor/rejected",
      permission: "doctor_manage_patients",
    },
   
    // {
    //   label: "Patient Billings",
    //   icon: <i className="ri-shopping-bag-4-fill" />,
    //   href: "/dashboard/doctor/patient/billings",
    //   permission: "doctor_manage_billings",
    // },
    {
      label: "Prescriptions",
      icon: <i className="ri-capsule-fill"></i>,
      href: "/dashboard/users/doctor/prescriptions",
      permission: "doctor_manage_prescriptions",
    },

    {
      label: "Transfer/Referral",
      icon: <i className="ri-arrow-left-right-fill" />,
      href: "/dashboard/users/doctor/referrals",
      permission: "doctor_manage_transfers",
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


// Super Admin OR NICRAT ICT
{
  label: "Patients",
  icon: <i className="ri-wheelchair-fill" />,
  href: "/dashboard/patients",
  permission: "view_all_hospitals",
},

    {
      label: "Hospitals",
      icon: <i className="ri-hospital-fill" />,
      href: "/dashboard/nicrat-ict/hospitals",
      permission: "view_all_hospitals",
    },

    {
      label: "Manage Users",
      icon: <i className="ri-group-fill" />,
      href: "/dashboard/users/hospital-admin",
      permission: "manage_hospital_admins",
    },

    {
      label: "Manage Services",
      icon: <i className="ri-service-fill" />,
      href: "/dashboard/services/",
      permission: "view_all_hospitals",
    },

    {
      label: "Manage Products",
      icon: <i className="ri-box-3-fill" />,
      href: "/dashboard/products/",
      permission: "view_all_hospitals",
    },

    {
      label: "Hospital Maps",
      icon: <i className="ri-map-line" />,
      href: "/dashboard/nicrat-ict/",
      permission: "view_all_hospitals",
    },



    // Hospital Admins
    {
      label: "Patients",
      icon: <i className="ri-wheelchair-fill" />,
      href: "/dashboard/users/hospital-admin/patients",
      permission: "hospital_admin_manage_hospital_patients",
    },

    {
      label: "Billings",
      icon: <i className="ri-shopping-bag-4-fill" />,
      href: "/dashboard/users/hospital-admin/billings",
      permission: "hospital_admin_view_patients_billings",
    },

    {
      label: "Generated Invoices",
      icon: <i className="ri-receipt-fill" />,
      href: "/dashboard/users/hospital-admin/billings",
      // modal: true,
      permission: "hospital_admin_view_patients_billings",
    },


    {
      label: "Manage Users",
      icon: <i className="ri-group-fill" />,
      href: "/dashboard/users/hospital-staff",
      permission: "manage_hospital_staff",
    },

// Social Welfare
{
  label: "My Patients",
  icon: <i className="ri-group-fill" />,
  href: "/dashboard/users/social-welfare/patients",
  permission: "social_welfare_manage_patients",
},
{
  label: "Reviewed Patients",
  icon: <i className="ri-check-fill" />,
  href: "/dashboard/users/social-welfare/reviewed",
  permission: "social_welfare_manage_patients",
},
{
  label: "Pending Patients",
  icon: <i className="ri-hourglass-fill" />,
  href: "/dashboard/users/social-welfare/pending",
  permission: "social_welfare_manage_patients",
},


// MDT Roles
{
  label: "All Patients",
  icon: <i className="ri-group-fill" />,
  href: "/dashboard/users/mdt/patients",
  permission: "mdt_manage_patients",
},
{
  label: "Reviewed Patients",
  icon: <i className="ri-check-fill" />,
  href: "/dashboard/users/mdt/reviewed",
  permission: "mdt_manage_patients",
},
{
  label: "Pending Patients",
  icon: <i className="ri-hourglass-fill" />,
  href: "/dashboard/users/mdt/pending",
  permission: "mdt_manage_patients",
},

{
  label: "Transfer/Referral",
  icon: <i className="ri-arrow-left-right-fill" />,
  href: "/dashboard/users/mdt/referrals",
  permission: "mdt_manage_transfers",
},


// CMD ROLES
{
  label: "My Patients",
  icon: <i className="ri-group-fill" />,
  href: "/dashboard/users/cmd/patients",
  permission: "cmd_manage_patients",
},
{
  label: "Reviewed Patients",
  icon: <i className="ri-check-fill" />,
  href: "/dashboard/users/cmd/reviewed",
  permission: "cmd_manage_patients",
},
{
  label: "Pending Patients",
  icon: <i className="ri-hourglass-fill" />,
  href: "/dashboard/users/cmd/pending",
  permission: "cmd_manage_patients",
},

{
  label: "Patient Billings",
  icon: <i className="ri-shopping-cart-fill" />,
  href: "/dashboard/users/cmd/pending",
  permission: "cmd_manage_billings",
},

{
  label: "Invoices",
  icon: <i className="ri-receipt-fill" />,
  href: "/dashboard/users/cmd/invoices",
  permission: "cmd_manage_billings",
},


// NICRAT DG ROLES
{
  label: "All Patients",
  icon: <i className="ri-group-fill" />,
  href: "/dashboard/users/nicrat/patients",
  permission: "dg_manage_patients",
},
{
  label: "Approved Patients",
  icon: <i className="ri-thumb-up-fill" />,
  href: "/dashboard/users/nicrat/reviewed",
  permission: "dg_manage_patients",
},
{
  label: "Awaiting Approval",
  icon: <i className="ri-hourglass-fill" />,
  href: "/dashboard/users/nicrat/pending",
  permission: "dg_manage_patients",
},


// NICRAT FANDA ROLES
{
  label: "Ewallets",
  icon: <i className="ri-wallet-fill" />,
  href: "/dashboard/nicrat-fanda/ewallet",
  permission: "fanda_topup_ewallet",
},

{
  label: "Hospital Billings",
  icon: <i className="ri-shopping-cart-fill" />,
  href: "/dashboard/users/nicrat/pending",
  permission: "fanda_topup_ewallet",
},

{
  label: "Hospitals",
  icon: <i className="ri-hospital-fill" />,
  href: "/dashboard/hospitals",
  permission: "dg_manage_hospitals",
},

{
  label: "Invoices",
  icon: <i className="ri-receipt-fill" />,
  href: "/dashboard/users/nicrat/invoices",
  permission: "dg_manage_invoices",
},

{
  label: "E-wallets",
  icon: <i className="ri-wallet-fill" />,
  href: "/dashboard/nicrat-fanda/ewallet",
  permission: "dg_manage_ewallets",
},

{
  label: "Analytics",
  icon: <i className="ri-pie-chart-2-fill" />,
  href: "/dashboard/users/nicrat/analytics",
  permission: "dg_manage_analytics",
},


// Pharmacist Roles
{
  label: "Prescriptions",
  icon: <i className="ri-capsule-fill"></i>,
  href: "/dashboard/users/pharmacist/prescriptions",
  permission: "pharmacist_manage_prescription",
},
{
  label: "My Patient Billings",
  icon: <i className="ri-shopping-bag-4-fill" />,
  href: "/dashboard/doctor/patient/billings",
  permission: "pharmacist_view_billings",
},
{
  label: "Hospital Patient Billings",
  icon: <i className="ri-shopping-bag-4-fill" />,
  href: "/dashboard/pharmacist/prescriptions",
  permission: "pharmacist_view_billings",
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
