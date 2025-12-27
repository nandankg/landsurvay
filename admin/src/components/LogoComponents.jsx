/**
 * Logo Components
 *
 * Reusable logo components that use centralized logo assets.
 * To change logos, simply replace the SVG/PNG files in public/logos/
 */

import { LogoAssets } from '../config/logoConfig'

/**
 * Bihar Government Logo
 */
export const BiharGovtLogo = ({ size = 48, className = '', alt = 'Bihar Government' }) => (
  <img
    src={LogoAssets.biharGovtLogo}
    alt={alt}
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)

/**
 * NIC (National Informatics Centre) Logo
 */
export const NICLogo = ({ size = 48, className = '', alt = 'NIC' }) => (
  <img
    src={LogoAssets.nicLogo}
    alt={alt}
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)

/**
 * Revenue Department Logo
 */
export const RevenueDeptLogo = ({ size = 48, className = '', alt = 'Revenue Department' }) => (
  <img
    src={LogoAssets.revenueDeptLogo}
    alt={alt}
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)

/**
 * Bihar Bhumi App Logo (Bodhi Tree)
 */
export const AppLogo = ({ size = 48, className = '', alt = 'Bihar Bhumi' }) => (
  <img
    src={LogoAssets.appLogo}
    alt={alt}
    width={size}
    height={size * 1.2}
    className={className}
    style={{ objectFit: 'contain' }}
  />
)

/**
 * Header Logos - Combined logos for header display
 */
export const HeaderLogos = ({ size = 40, className = '' }) => (
  <div className={`header-logos ${className}`} style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
    <BiharGovtLogo size={size} />
    <AppLogo size={size * 0.8} />
    <NICLogo size={size} />
  </div>
)

/**
 * Footer Logos - Combined logos for footer display
 */
export const FooterLogos = ({ size = 35, className = '' }) => (
  <div className={`footer-logos ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.5 }}>
      <BiharGovtLogo size={size} />
      <NICLogo size={size} />
      <RevenueDeptLogo size={size} />
    </div>
    <span style={{ fontSize: 10, color: '#999' }}>Powered by NIC</span>
  </div>
)

// Legacy export for backward compatibility
export const GovEmblem = BiharGovtLogo

export default {
  BiharGovtLogo,
  NICLogo,
  RevenueDeptLogo,
  AppLogo,
  HeaderLogos,
  FooterLogos,
  GovEmblem,
}
