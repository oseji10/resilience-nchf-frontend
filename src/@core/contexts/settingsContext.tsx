'use client'

// React Imports
import type { ReactNode } from 'react'
import { createContext, useMemo, useState } from 'react'

// Type Imports
import type { Mode } from '@/@core/types'

// Config Imports
import themeConfig from '@/configs/themeConfig'

// Settings type
export type Settings = {
  mode?: Mode
}

// UpdateSettingsOptions type
type UpdateSettingsOptions = {}

// SettingsContextProps type
type SettingsContextProps = {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  isSettingsChanged: boolean
  resetSettings: () => void
  updatePageSettings: (settings: Partial<Settings>) => () => void
}

type Props = {
  children: ReactNode
  mode?: Mode
}

// Initial Settings Context
export const SettingsContext = createContext<SettingsContextProps | null>(null)

// Settings Provider
export const SettingsProvider = (props: Props) => {
  // Initial Settings
  const initialSettings: Settings = {
    mode: props.mode || themeConfig.mode
  }

  // State
  const [_settingsState, _updateSettingsState] = useState<Settings>(initialSettings)

  const updateSettings = (settings: Partial<Settings>) => {
    _updateSettingsState(prev => ({ ...prev, ...settings }))
  }

  const updatePageSettings = (settings: Partial<Settings>): (() => void) => {
    updateSettings(settings)

    // Returns a function to reset the page settings
    return () => updateSettings(initialSettings)
  }

  const resetSettings = () => {
    updateSettings(initialSettings)
  }

  const isSettingsChanged = useMemo(
    () => JSON.stringify(initialSettings) !== JSON.stringify(_settingsState),
    [_settingsState]
  )

  return (
    <SettingsContext.Provider
      value={{
        settings: _settingsState,
        updateSettings,
        isSettingsChanged,
        resetSettings,
        updatePageSettings
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  )
}
