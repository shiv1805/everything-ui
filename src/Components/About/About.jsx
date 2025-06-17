import React, { useState } from "react";

import { Button, Grid, Typography } from "@mui/material";
import GetInvoice from "./Invoice";

export default function About() {
  return (
    <div>
      <Typography variant="h5">About</Typography>
      <GetInvoice />
    </div>
  );
}
