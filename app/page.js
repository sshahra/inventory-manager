"use client";
import { useEffect, useState } from 'react';
import { Container, TextField, Button, Box,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Dialog, DialogContent ,useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
//import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '@/firebase';
import { collection, addDoc, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useTheme } from '@mui/material/styles';


const StyledContainer = styled(Container)({
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#fafafa',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledButton = styled(Button)({
  marginTop: '1rem',
  backgroundColor: '#6a0dad',
  color: '#FFF',
  '&:hover': {
    backgroundColor: '#4b0082',
  },
});

const StyledTableContainer = styled(TableContainer)({
  marginTop: '2rem',
  backgroundColor: '#fafafa',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledTableCell = styled(TableCell)({
  color: '#4b0082',
  fontWeight: 'bold',
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: '#4b0082',
  },
  '& .MuiInputLabel-root': {
    color: '#4b0082',
  },
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4b0082',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#6a0dad',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4b0082',
  },
});

const TopButton = styled(Button)({
  position: 'absolute',
  top: '1rem',
  zIndex: 1000,
  '&:hover': {
    backgroundColor: '#4b0082',
  },

});

export default function Home() {
  const [item, setItem] = useState({ name: '', quantity: '', price: '' });
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (item.name !== '' && item.quantity !== '' && item.price !== '') {
      await addDoc(collection(db, 'inventory'), {
        name: item.name,
        quantity: item.quantity,
        price: item.price
      });
      setItem({ name: '', quantity: '', price: '' });
    }
  };

  const handleDeleteItem = async (id) => {
    await deleteDoc(doc(db, 'inventory', id));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const snapshot = query(collection(db, 'inventory'));
      const unsubscribe = onSnapshot(snapshot, (querySnapshot) => {
        const inventoryData = [];
        querySnapshot.forEach((doc) => {
          inventoryData.push({ ...doc.data(), id: doc.id });
        });
        setInventory(inventoryData);
      });

      return () => unsubscribe();
    }
  }, []);

  const filteredInventory = inventory.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

  return (
    <div>
      <StyledButton style={{ left: '1rem' }} variant="contained" onClick={() => setInfoOpen(true)}>
        Info
      </StyledButton>
      <TopButton style={{ right: '1rem' ,backgroundColor: '#6a0dad'  }} variant="contained" href="https://github.com/sshahra/inventory-manager">
        GitHub
      </TopButton>
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)}>
        <DialogContent>
          <Typography variant="h5" style={{ color: '#4b0082', fontFamily: 'Roboto, sans-serif' }}>
            About
          </Typography>
          <Typography variant="body1" style={{ color: '#4b0082', fontFamily: 'Roboto, sans-serif' }}>
            Devloper : Shubh  Shahra
            {/* add next line */}
            <br/>
            This is a simple inventory manager app that allows you to add and delete items from a list. It is built using Firebase and Next.js.
          </Typography>
          <Box>
          <iframe width="100%" height="350rm" src="https://www.youtube.com/embed/LQQ4CKYTUek" title="Inventory Manager Demo 👩 💻" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </Box>
        </DialogContent>
      </Dialog>
      <StyledContainer maxWidth="sm">
        <Typography  variant={isMobile ? 'h4' : 'h3'} style={{ marginBottom: '1.5rem', color: '#4b0082', fontFamily: 'Roboto, sans-serif' }}>
          Inventory Manager
        </Typography>
        
        <Typography variant="h5" style={{ color: '#4b0082', fontFamily: 'Roboto, sans-serif' }}>
          Add New Item
        </Typography>
        <StyledTextField
          label="Item Name"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <StyledTextField
          label="Quantity"
          value={item.quantity}
          onChange={(e) => setItem({ ...item, quantity: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <StyledTextField
          label="Price ($)"
          value={item.price}
          onChange={(e) => setItem({ ...item, price: e.target.value })}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <StyledButton variant="contained" onClick={handleAddItem}>
          Add Item
        </StyledButton>
        <StyledTextField
          label="Search for Item"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth 
          margin="normal"
          variant="outlined"
        />
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Item</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">Price ($)</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell align="right">{entry.quantity}</TableCell>
                  <TableCell align="right">{entry.price}</TableCell>
                  <TableCell align="right">
                    <IconButton color="secondary" onClick={() => handleDeleteItem(entry.id)}>
                      {/* <DeleteIcon /> */}
                      <a>❌</a>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledContainer>
    </div>
  );
}
