import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('خطأ في تسجيل الخروج:', err);
        }
    }

    return (
        <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
            <Toolbar>
                <LocalHospital sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    حجز مواعيد الأطباء
                </Typography>
                <Button color="inherit" onClick={() => navigate('/doctors')}>
                    الأطباء
                </Button>

                {currentUser && (
                    <Button color="inherit" onClick={() => navigate('/appointments')}>
                        مواعيدي
                    </Button>
                )}
                <Box>
                    {currentUser ? (
                        <>
                            <Typography variant="body1" component="span" sx={{ mr: 2 }}>
                                مرحباً، {currentUser.displayName}
                            </Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                خروج
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                دخول
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/signup')}>
                                حساب جديد
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}