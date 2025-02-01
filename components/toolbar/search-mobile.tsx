'use client';

import { useState } from 'react';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import SearchDialog from '../search-dialog';
import { Button } from '../ui/button';

export default function SearchMobile() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <MagnifyingGlassIcon />
      </Button>
      <SearchDialog open={open} setOpen={setOpen} />
    </>
  );
}
