import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';

interface ButtonAppBarProps {
  title: string;
}

export default function ButtonAppBar({ title }: ButtonAppBarProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string | undefined) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t(title)}
          </Typography>
          <Button color="inherit" onClick={() => changeLanguage('en')}>
            English
          </Button>
          <Button color="inherit" onClick={() => changeLanguage('pl')}>
            Polski
          </Button>
          <Button color="inherit">{t('log out')}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
