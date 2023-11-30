import React, { useState } from 'react';
import { DetailsForm } from '../components/DetailsForm';

export function Signup() {

    return (
      <div>
        <DetailsForm signInOrUpdate="signup"></DetailsForm>
      </div>     
    )
  }