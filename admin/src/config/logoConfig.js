/**
 * Logo Configuration
 *
 * This file centralizes all logo asset paths for easy replacement.
 * To update logos, simply replace the SVG/PNG files in the public/logos/ folder
 * with the actual department logos while keeping the same filenames.
 *
 * Supported formats: SVG (recommended), PNG, JPG
 *
 * Required logos:
 * 1. bihar_govt_logo.svg - Bihar Government Official Logo
 * 2. nic_logo.svg - National Informatics Centre (NIC) Logo
 * 3. revenue_dept_logo.svg - Revenue Department Logo
 * 4. app_logo.svg - Bihar Bhumi App Logo (Bodhi Tree)
 */

// Base path for all logo assets (relative to public folder)
const LOGO_BASE_PATH = '/logos'

export const LogoAssets = {
  // Bihar Government Official Logo
  // Replace with: Official Bihar Sarkar emblem
  biharGovtLogo: `${LOGO_BASE_PATH}/bihar_govt_logo.png`,

  // National Informatics Centre (NIC) Logo
  // Replace with: Official NIC logo
  nicLogo: `${LOGO_BASE_PATH}/nic_logo.png`,

  // Revenue Department Logo
  // Replace with: Official Revenue & Land Reforms Department logo
  revenueDeptLogo: `${LOGO_BASE_PATH}/revenue_dept_logo.png`,

  // Bihar Bhumi App Logo (Bodhi Tree)
  // Replace with: Official Bihar Bhumi logo
  appLogo: `${LOGO_BASE_PATH}/app_logo.svg`,
}

// Alternative names for convenience
export const Logos = {
  bihar: LogoAssets.biharGovtLogo,
  nic: LogoAssets.nicLogo,
  revenue: LogoAssets.revenueDeptLogo,
  app: LogoAssets.appLogo,
}

export default LogoAssets
