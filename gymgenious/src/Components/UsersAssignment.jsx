import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import Loader from '../real_components/loader.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

export default function UserAssignment({ onUsersChange, routine,routineDay }) {
  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningFetchingUsers, setWarningFetchingUsers] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:950px)');

  const [openSearch, setOpenSearch] = useState(false);
  const [filterUsers, setFilterUsers] = useState('');
  const [totalUsers, setTotalUsers] = useState([]);

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearchUsers = () => {
    setOpenSearch(false);
    const totalUsersCorrected = totalUsers.reduce((acc, current) => {
      const x = acc.find(item => item.Mail === current.Mail);
      if (!x) {
        acc.push(current);
      }
      return acc;
    }, []);
    setUsers(totalUsersCorrected);
  };
  
  useEffect(() => {
    onUsersChange(selectedUsers); 
  }, [selectedUsers, onUsersChange]);

  const fetchUsers = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const assignedResponse = await fetch(`https://two025-duplagalactica-final.onrender.com/get_assigned_routines`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!assignedResponse.ok) {
        throw new Error('Error al obtener las rutinas asignadas: ' + assignedResponse.statusText);
      }
      const assignedUsersData = await assignedResponse.json();
      const assignedUsersData2 = assignedUsersData.filter(routi => routi.id==routine && routi.day==routineDay)
      const assignedUsers = assignedUsersData2.flatMap(routine => 
        routine.users.map(user => user)
      );
      const allUsersResponse = await fetch(`https://two025-duplagalactica-final.onrender.com/get_users`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
      if (!allUsersResponse.ok) {
        throw new Error('Error al obtener los usuarios: ' + allUsersResponse.statusText);
      }
      const allUsers = await allUsersResponse.json();
      const filteredRows = allUsers.filter(user => user.type=='client');
      const filteredRowsRight = allUsers.filter(user => assignedUsers.includes(user.Mail));
      setUsers(filteredRows);
      setSelectedUsers(filteredRowsRight);
      setTotalUsers(filteredRows.concat(filteredRowsRight));
      setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setOpenCircularProgress(false);
      setWarningFetchingUsers(true);
      setTimeout(() => {
        setWarningFetchingUsers(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if(filterUsers!=''){
      const filteredUsersSearcher = totalUsers
      .filter(item => item.Mail.toLowerCase().startsWith(filterUsers.toLowerCase()))
      .reduce((acc, current) => {
        const x = acc.find(item => item.Mail === current.Mail);
        if (!x) {
          acc.push(current);
        }
        return acc;
      }, []);
      setUsers(filteredUsersSearcher);
    } else {
      const totalUsersCorrected = totalUsers.reduce((acc, current) => {
        const x = acc.find(item => item.Mail === current.Mail);
        if (!x) {
          acc.push(current);
        }
        return acc;
      }, []);
      setUsers(totalUsersCorrected);
    }
  }, [filterUsers]);

  useEffect(() => {
    if (routine && routineDay) {
      fetchUsers();
    } else {
      setUsers([]);
      setSelectedUsers([]);
    }
  }, [routine,routineDay]);

  const handleAddUser = (user) => {
      handleCloseSearchUsers();
      setSelectedUsers([...selectedUsers, user]);
  };

  const handleDeleteUser = (user) => {
    handleCloseSearchUsers();
    const updatedSelectedUsers = selectedUsers.filter(stateUser => stateUser.Mail !== user.Mail);
    setSelectedUsers(updatedSelectedUsers);
  }

  const customList = (items) => (
    <div className='transfer-list'>
      <List dense component="div" role="list">
        {items.map((user) => {
          const labelId = `transfer-list-item-${user.Mail}-label`;
          return (
            <>
            { (selectedUsers?.some(stateUser => stateUser.Mail === user.Mail)) ? (
              <ListItemButton
              sx={{backgroundColor:'#091057'}}
              key={user.Mail}
              role="listitem"
              onClick={() => handleDeleteUser(user)}
            >
              {isSmallScreen ? (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', color: 'white' }}>{user.Mail}</p></ListItemText>
                ) : (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%', color: 'white' }}>{user.Mail}</p></ListItemText>
                )}
              <DeleteIcon sx={{color:'white'}}/>
            </ListItemButton>
            ) : (
              <ListItemButton
              key={user.Mail}
              role="listitem"
              onClick={() => handleAddUser(user)}
            >
              {isSmallScreen ? (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{user.Mail}</p></ListItemText>
                ) : (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>{user.Mail}</p></ListItemText>
                )}
              <AddCircleOutlineSharpIcon/>
            </ListItemButton>
            )}
            </>
          );
        })}
      </List>
    </div>
  );

  return (
    <div className="'grid-transfer-container" style={{display:'flex', justifyContent: 'space-between'}}>
        {!(routine && routineDay) ? (
          <Grid item>
            <Typography sx={{ color: '#424242', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
              Select a routine and a day to assign
            </Typography>
          </Grid>
        ) : (
              <div className="input-small-container">
                {openSearch ? (
                      <input
                      type="text"
                      className="search-input"
                      placeholder="Search..."
                      style={{
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      width: isSmallScreen ? '60%' : '30%',
                      marginBottom: isSmallScreen ? '3%' : '1%',
                      }}
                      id={filterUsers}
                      onChange={(e) => setFilterUsers(e.target.value)} 
                  />
                  ) : (
                  <Button onClick={handleOpenSearch}
                  style={{
                      backgroundColor: '#48CFCB',  
                      marginBottom: isSmallScreen ? '3%' : '1%',
                      borderRadius: '50%',
                      width: '5vh',
                      height: '5vh',
                      minWidth: '0',
                      minHeight: '0',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  }}
                  >
                  <SearchIcon sx={{ color: '#424242' }} />
                  </Button>
                  )}
                  {users.length===0 ? (
                    <Grid item>
                    <Typography sx={{ color: '#424242', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white' }}>
                      There are no users
                    </Typography>
                  </Grid>
                  ) : (
                <Grid className='grid-transfer-content-users' item>{customList(users)}</Grid>
                  )}
              </div>
        )}
      {openCircularProgress ? (
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={openCircularProgress}
        >
          <Loader></Loader>
        </Backdrop>
      ) : null}
      {warningFetchingUsers ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningFetchingUsers} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                  Error fetching users. Try again!
                </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      ) : null}
    </div>
  );
}
