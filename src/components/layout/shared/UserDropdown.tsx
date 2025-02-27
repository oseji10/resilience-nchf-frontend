'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Cookies from 'js-cookie'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const UserDropdown = () => {
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  
  const router = useRouter()
  const anchorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const authToken = Cookies.get("authToken")
    if (!authToken || authToken === "null" || authToken === "undefined") {
      router.push("/login") // Redirect if not authenticated
    } else {
      setToken(authToken)
      setRole(Cookies.get("role") || "")
      setName(Cookies.get("name") || "")
    }
  }, [router])

  const handleDropdownOpen = () => {
    setOpen(!open)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const getRoleName = (role: string | null) => {
    switch (role) {
      case "1": return "Patient"
      case "2": return "Doctor"
      case "3": return "Social Welfare"
      case "4": return "MDT"
      case "5": return "Other Staff"
      case "6": return "Hospital Admin"
      case "7": return "CMD"
      case "8": return "NICRAT DESK"
      case "9": return "NICRAT F&A"
      case "10": return "NICRAT ICT"
      case "11": return "NICRAT DG"
      case "12": return "SUPER ADMIN"
      case "13": return "PHARMACIST"
      case "14": return "NURSE"
      default: return "Unknown Role"
    }
  }

  const handleLogout = () => {
    Cookies.remove('name')
    Cookies.remove('email')
    Cookies.remove('firstName')
    Cookies.remove('lastName')
    Cookies.remove('phoneNumber')
    Cookies.remove('authToken')
    Cookies.remove('role')
    router.push('/login')
  }

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          alt='John Doe'
          src='/images/avatars/1.png'
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className='shadow-lg'>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                    <Avatar alt='John Doe' src='/images/avatars/1.png' />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {name}
                      </Typography>
                      <Typography variant='caption'>{getRoleName(role)}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <a href='/dashboard/profile'>
                    <MenuItem className='gap-3'>
                      <i className='ri-user-3-line' />
                      <Typography color='text.primary'>Edit Profile</Typography>
                    </MenuItem>
                  </a>
                  <div className='flex items-center plb-2 pli-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={handleLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
