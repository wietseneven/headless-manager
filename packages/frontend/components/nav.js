import Link from 'next/link';
import { Box } from '@mui/material';

const Nav = () => {
  return (
    <Box component="nav">
      <Box
        component="ul"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          listStyle: 'none',
          m: 0,
          p: 0,
        }}
      >
        <li>
          <Link href="/">
            <a>Projects</a>
          </Link>
        </li>
      </Box>
    </Box>
  );
};

export default Nav;
