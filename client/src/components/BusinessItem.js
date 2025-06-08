import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const BusinessPostItem = ({ title, content }) => (
  <Card sx={{ margin: 2 }}>
    <CardContent>
      <Typography variant="h5">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {content}
      </Typography>
    </CardContent>
  </Card>
);

export default BusinessPostItem;
