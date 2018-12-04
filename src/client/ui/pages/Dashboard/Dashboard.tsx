import React from 'react';

import ElmComponent from '@/ui/components/ElmComponent';
import { Elm } from '@/Main.elm';

function Dashboard() {
  return (
    <div className="dashboard">
      <ElmComponent src={Elm.Main} flags={true} />
    </div>
  );
}

export default Dashboard;
