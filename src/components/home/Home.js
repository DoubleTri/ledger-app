import React, { useState, useContext } from 'react';
import { Button } from 'antd';

import { AuthContext } from '../../context/UserContext';

const Home = () => {

    let { logout } = useContext(AuthContext)

  return (
      <div>
          <h2>Home Page</h2>
          <br />
          <Button type="primary" onClick={logout}>
              Logout
        </Button>
      </div>
  );
};

export default Home; 