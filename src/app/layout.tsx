// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@/@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@/assets/iconify-icons/generated-icons.css'
// import '@/app/';


export const metadata = {
  title: 'Resilience Nigeria - National Cancer Health Fund',
  description:
    'Cancer care for all nigerians',
}

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
