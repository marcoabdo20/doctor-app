import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,  // ← ← ← استورد ده
  ListItemIcon,
  ListItemText,
  Divider,
  useScrollTrigger,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Notifications,
  Dashboard,
  CalendarMonth,
  Logout,
  Login,
  PersonAdd,
  Menu as MenuIcon,
  MedicalServices,
} from '@mui/icons-material';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  teal50:  '#E8F5F0',
  teal100: '#C3E8D8',
  teal400: '#1D9E75',
  teal600: '#0F6E56',
  teal800: '#085041',
  neutral50:  '#F7F8FA',
  neutral100: '#ECEEF2',
  neutral200: '#D1D5DB',
  neutral300: '#C8CDD8',
  neutral600: '#6B7280',
  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
  shadowMd: '0 4px 24px rgba(0,0,0,0.10)',
};

// ─── HideOnScroll ─────────────────────────────────────────────────────────────

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({ threshold: 10 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ onClick, isRTL }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        flexShrink: 0,
        userSelect: 'none',
        transition: 'opacity .2s',
        '&:hover': { opacity: 0.8 },
      }}
    >
      <Box
        sx={{
          width: { xs: 32, sm: 38 },
          height: { xs: 32, sm: 38 },
          background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 2px 8px ${T.teal400}44`,
          flexShrink: 0,
        }}
      >
        <MedicalServices sx={{ fontSize: { xs: 16, sm: 20 }, color: '#fff' }} />
      </Box>
      <Box sx={{ lineHeight: 1, display: { xs: 'none', sm: 'block' } }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 16, sm: 19 },
            color: T.teal600,
            lineHeight: 1.1,
            letterSpacing: isRTL ? 0 : '-0.3px',
          }}
        >
          {isRTL ? 'طبيبك' : 'Tabibak'}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 9, sm: 10 },
            color: T.neutral600,
            fontWeight: 500,
            letterSpacing: '0.04em',
            display: { xs: 'none', md: 'block' },
          }}
        >
          {isRTL ? 'رعاية صحية متكاملة' : 'Complete Healthcare'}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

function NavLink({ label, active, onClick }) {
  return (
    <Button
      onClick={onClick}
      disableRipple
      sx={{
        px: { sm: 1.5, md: 2 },
        py: 0.875,
        borderRadius: '10px',
        fontSize: { sm: 12.5, md: 13 },
        fontWeight: 600,
        color: active ? T.teal600 : T.neutral600,
        bgcolor: active ? T.teal50 : 'transparent',
        border: active ? `1.5px solid ${T.teal100}` : '1.5px solid transparent',
        minWidth: 0,
        transition: 'all .18s',
        whiteSpace: 'nowrap',
        '&:hover': {
          bgcolor: T.teal50,
          color: T.teal600,
          border: `1.5px solid ${T.teal100}`,
        },
      }}
    >
      {label}
    </Button>
  );
}

// ─── LangToggle ─────────────────────────────────────────────────────────────

function LangToggle({ language, onClick }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label="Toggle language"
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        border: `1.5px solid ${T.neutral100}`,
        bgcolor: T.neutral50,
        color: T.neutral600,
        transition: 'all .18s',
        '&:hover': {
          border: `1.5px solid ${T.teal400}`,
          color: T.teal600,
          bgcolor: T.teal50,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.03em',
        }}
      >
        {language === 'ar' ? 'EN' : 'ع'}
      </Typography>
    </IconButton>
  );
}

// ─── NavIconBtn ───────────────────────────────────────────────────────────────

function NavIconBtn({ children, onClick, label }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={label}
      size="small"
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        border: `1.5px solid ${T.neutral100}`,
        bgcolor: T.neutral50,
        color: T.neutral600,
        transition: 'all .18s',
        '&:hover': {
          border: `1.5px solid ${T.teal400}`,
          color: T.teal600,
          bgcolor: T.teal50,
        },
      }}
    >
      {children}
    </IconButton>
  );
}

// ─── UserAvatar ───────────────────────────────────────────────────────────────

function UserAvatar({ displayName, onClick }) {
  const initial = displayName?.charAt(0).toUpperCase() ?? '?';
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 800,
        color: '#fff',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: `0 2px 8px ${T.teal400}44`,
        transition: 'transform .18s, box-shadow .18s',
        '&:hover': {
          transform: 'scale(1.06)',
          boxShadow: `0 4px 14px ${T.teal400}55`,
        },
      }}
    >
      {initial}
    </Box>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const { currentUser, userRole, logout } = useAuth();
  const { t, toggleLanguage, language }   = useLanguage();
  const navigate  = useNavigate();
  const location  = useLocation();
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'));
  const isRTL     = language === 'ar';

  const [anchorEl, setAnchorEl]     = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleMenuOpen  = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  async function handleLogout() {
    handleMenuClose();
    setDrawerOpen(false);
    try { await logout(); navigate('/'); }
    catch (err) { console.error('Logout error:', err); }
  }

  // ── Drawer nav items ──────────────────────────────────────────────────────
  const drawerItems = [
    {
      label: t('doctors'),
      icon: <MedicalServices sx={{ fontSize: 19, color: T.teal400 }} />,
      active: isActive('/doctors'),
      onClick: () => { navigate('/doctors'); setDrawerOpen(false); },
    },
    ...(currentUser && userRole === 'patient' ? [{
      label: t('appointments'),
      icon: <CalendarMonth sx={{ fontSize: 19, color: T.teal400 }} />,
      active: isActive('/appointments'),
      onClick: () => { navigate('/appointments'); setDrawerOpen(false); },
    }] : []),
    ...(currentUser && userRole === 'doctor' ? [{
      label: t('dashboard'),
      icon: <Dashboard sx={{ fontSize: 19, color: T.teal400 }} />,
      active: isActive('/doctor-dashboard'),
      onClick: () => { navigate('/doctor-dashboard'); setDrawerOpen(false); },
    }] : []),
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: `1px solid ${T.neutral100}`,
            color: 'text.primary',
          }}
        >
          <Toolbar
            sx={{
              justifyContent: 'space-between',
              minHeight: { xs: 56, sm: 64 },
              px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
              gap: { xs: 0.5, sm: 1, md: 2 },
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            {/* Logo */}
            <Logo onClick={() => navigate('/')} isRTL={isRTL} />

            {/* Desktop nav - centered */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flex: 1,
                  justifyContent: 'center',
                  mx: { sm: 1, md: 2, lg: 3 },
                }}
              >
                <NavLink
                  label={t('doctors')}
                  active={isActive('/doctors')}
                  onClick={() => navigate('/doctors')}
                />
                {currentUser && userRole === 'patient' && (
                  <NavLink
                    label={t('appointments')}
                    active={isActive('/appointments')}
                    onClick={() => navigate('/appointments')}
                  />
                )}
                {currentUser && userRole === 'doctor' && (
                  <NavLink
                    label={t('dashboard')}
                    active={isActive('/doctor-dashboard')}
                    onClick={() => navigate('/doctor-dashboard')}
                  />
                )}
              </Box>
            )}

            {/* Right actions */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, sm: 0.75, md: 1 },
                flexShrink: 0,
              }}
            >
              <LangToggle language={language} onClick={toggleLanguage} />

              {currentUser ? (
                <>
                  {/* Notifications - hidden on small mobile */}
                  <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                    <NavIconBtn label={isRTL ? 'الإشعارات' : 'Notifications'}>
                      <Badge
                        badgeContent={0}
                        color="error"
                        sx={{ '& .MuiBadge-badge': { fontSize: 9, minWidth: 14, height: 14 } }}
                      >
                        <Notifications sx={{ fontSize: 18 }} />
                      </Badge>
                    </NavIconBtn>
                  </Box>

                  {/* Avatar */}
                  <UserAvatar
                    displayName={currentUser.displayName}
                    onClick={isMobile ? () => setDrawerOpen(true) : handleMenuOpen}
                  />

                  {/* Mobile menu button */}
                  {isMobile && (
                    <NavIconBtn
                      label={isRTL ? 'القائمة' : 'Menu'}
                      onClick={() => setDrawerOpen(true)}
                    >
                      <MenuIcon sx={{ fontSize: 18 }} />
                    </NavIconBtn>
                  )}

                  {/* Desktop dropdown */}
                  {!isMobile && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      transformOrigin={{
                        horizontal: isRTL ? 'left' : 'right',
                        vertical: 'top',
                      }}
                      anchorOrigin={{
                        horizontal: isRTL ? 'left' : 'right',
                        vertical: 'bottom',
                      }}
                      slotProps={{  // ← ← ← استخدم slotProps بدل PaperProps
                        paper: {
                          sx: {
                            mt: 1.25,
                            minWidth: 220,
                            borderRadius: '14px',
                            border: `1px solid ${T.neutral100}`,
                            boxShadow: T.shadowMd,
                            direction: isRTL ? 'rtl' : 'ltr',
                            overflow: 'visible',
                            '&::before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: -6,
                              [isRTL ? 'left' : 'right']: 16,
                              width: 12,
                              height: 12,
                              bgcolor: 'background.paper',
                              border: `1px solid ${T.neutral100}`,
                              borderRight: 'none',
                              borderBottom: 'none',
                              transform: 'rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                    >
                      {/* User header */}
                      <Box sx={{ px: 2.5, py: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            direction: isRTL ? 'rtl' : 'ltr',
                          }}
                        >
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: '10px',
                              background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 15,
                              fontWeight: 800,
                              color: '#fff',
                              flexShrink: 0,
                            }}
                          >
                            {currentUser.displayName?.charAt(0).toUpperCase() ?? '?'}
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              noWrap
                              sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}
                            >
                              {currentUser.displayName}
                            </Typography>
                            <Typography
                              noWrap
                              sx={{ fontSize: 11, color: T.neutral600 }}
                            >
                              {currentUser.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: T.neutral100 }} />

                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          gap: isRTL ? 0 : 1.5,
                          px: 2.5,
                          py: 1.5,
                          mx: 1,
                          my: 0.5,
                          borderRadius: '10px',
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'error.main',
                          direction: isRTL ? 'rtl' : 'ltr',
                          '&:hover': { bgcolor: '#FFF0F0' },
                        }}
                      >
                        <Logout
                          sx={{
                            fontSize: 17,
                            color: 'error.main',
                            [isRTL ? 'ml' : 'mr']: 1.5,
                          }}
                        />
                        {t('logout')}
                      </MenuItem>
                    </Menu>
                  )}
                </>
              ) : (
                /* Logged-out CTA buttons */
                <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 0.75, md: 1 } }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: '10px',
                      fontSize: { xs: 11, sm: 12 },
                      fontWeight: 700,
                      px: { xs: 1.25, sm: 1.5, md: 2 },
                      py: 0.75,
                      border: `1.5px solid ${T.neutral200}`,
                      color: T.neutral600,
                      bgcolor: T.neutral50,
                      minWidth: 0,
                      transition: 'all .18s',
                      '&:hover': {
                        border: `1.5px solid ${T.teal400}`,
                        color: T.teal600,
                        bgcolor: T.teal50,
                      },
                    }}
                  >
                    {isMobile ? (isRTL ? 'دخول' : 'Login') : t('login')}
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => navigate('/signup')}
                    sx={{
                      borderRadius: '10px',
                      fontSize: { xs: 11, sm: 12 },
                      fontWeight: 700,
                      px: { xs: 1.25, sm: 1.5, md: 2 },
                      py: 0.75,
                      minWidth: 0,
                      background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
                      color: '#fff',
                      boxShadow: `0 2px 8px ${T.teal400}44`,
                      transition: 'all .18s',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${T.teal600} 0%, ${T.teal800} 100%)`,
                        boxShadow: `0 4px 14px ${T.teal400}55`,
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    {isMobile ? (isRTL ? 'تسجيل' : 'Sign up') : t('signup')}
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      <Drawer
        anchor={isRTL ? 'left' : 'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{  // ← ← ← استخدم slotProps
          paper: {
            sx: {
              width: { xs: '80vw', sm: 320 },
              maxWidth: 360,
              direction: isRTL ? 'rtl' : 'ltr',
            },
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderBottom: `1px solid ${T.neutral100}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo onClick={() => { navigate('/'); setDrawerOpen(false); }} isRTL={isRTL} />
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              border: `1.5px solid ${T.neutral100}`,
              color: T.neutral600,
            }}
          >
            <MenuIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* User info */}
        {currentUser && (
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              bgcolor: T.teal50,
              mx: { xs: 1.5, sm: 2 },
              mt: { xs: 1.5, sm: 2 },
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${T.teal400} 0%, ${T.teal600} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {currentUser.displayName?.charAt(0).toUpperCase() ?? '?'}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>
                {currentUser.displayName}
              </Typography>
              <Typography noWrap sx={{ fontSize: 11.5, color: T.neutral600 }}>
                {currentUser.email}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Nav list */}
        <List sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
          {drawerItems.map((item) => (
            <ListItemButton  // ← ← ← ListItemButton بدل ListItem button
              key={item.label}
              onClick={item.onClick}
              sx={{
                borderRadius: '12px',
                mb: 0.5,
                py: 1.25,
                px: 1.75,
                bgcolor: item.active ? T.teal50 : 'transparent',
                border: `1.5px solid ${item.active ? T.teal100 : 'transparent'}`,
                transition: 'all .15s',
                '&:hover': {
                  bgcolor: T.teal50,
                  border: `1.5px solid ${T.teal100}`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  [isRTL ? 'ml' : 'mr']: 1.75,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {/* ← ← ← Typography منفصل بدل primaryTypographyProps */}
              <ListItemText>
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: item.active ? T.teal600 : 'text.secondary',
                  }}
                >
                  {item.label}
                </Typography>
              </ListItemText>
            </ListItemButton>
          ))}

          {currentUser && (
            <>
              <Divider sx={{ my: 1.25, borderColor: T.neutral100, mx: 1 }} />
              <ListItemButton  // ← ← ← ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: '12px',
                  py: 1.25,
                  px: 1.75,
                  mx: 0.5,
                  transition: 'all .15s',
                  '&:hover': { bgcolor: '#FFF0F0' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, [isRTL ? 'ml' : 'mr']: 1.75 }}>
                  <Logout sx={{ fontSize: 19, color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    sx={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: 'error.main',
                    }}
                  >
                    {t('logout')}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}